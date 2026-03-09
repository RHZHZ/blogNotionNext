import replaceSearchResult from '@/components/Mark'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import algoliasearch from 'algoliasearch'
import throttle from 'lodash/throttle'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import { useHotkeys } from 'react-hotkeys-hook'

const ShortCutActions = [
  {
    key: '↑ ↓',
    action: '选择'
  },
  {
    key: 'Enter',
    action: '跳转'
  },
  {
    key: 'Esc',
    action: '关闭'
  }
]

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */
export default function AlgoliaSearchModal({ cRef }) {
  const [searchResults, setSearchResults] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [totalHit, setTotalHit] = useState(0)
  const [useTime, setUseTime] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const inputRef = useRef(null)
  const router = useRouter()

  /**
   * 快捷键设置
   */
  useHotkeys('ctrl+k', e => {
    e.preventDefault()
    setIsModalOpen(true)
  })
  // 修改快捷键的使用逻辑
  useHotkeys(
    'down',
    e => {
      if (isInputFocused) {
        // 只有在聚焦时才触发
        e.preventDefault()
        if (activeIndex < searchResults.length - 1) {
          setActiveIndex(activeIndex + 1)
        }
      }
    },
    { enableOnFormTags: true }
  )
  useHotkeys(
    'up',
    e => {
      if (isInputFocused) {
        e.preventDefault()
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1)
        }
      }
    },
    { enableOnFormTags: true }
  )
  useHotkeys(
    'esc',
    e => {
      if (isInputFocused) {
        e.preventDefault()
        setIsModalOpen(false)
      }
    },
    { enableOnFormTags: true }
  )
  useHotkeys(
    'enter',
    e => {
      if (isInputFocused && searchResults.length > 0) {
        e.preventDefault()
        onJumpSearchResult()
      }
    },
    { enableOnFormTags: true }
  )
  // 跳转Search结果
  const onJumpSearchResult = () => {
    if (searchResults.length > 0) {
      const searchResult = searchResults[activeIndex]
      window.location.href = `${siteConfig('SUB_PATH', '')}/${searchResult.slug || searchResult.objectID}`
    }
  }

  const resetSearch = () => {
    setActiveIndex(0)
    setKeyword('')
    setSearchResults([])
    setUseTime(0)
    setTotalPage(0)
    setTotalHit(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  /**
   * 页面路径变化后，自动关闭此modal
   */
  useEffect(() => {
    setIsModalOpen(false)
  }, [router])

  /**
   * 自动聚焦搜索框
   */
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      resetSearch()
    }
  }, [isModalOpen])

  /**
   * 对外暴露方法
   **/
  useImperativeHandle(cRef, () => {
    return {
      openSearch: () => {
        setIsModalOpen(true)
      }
    }
  })

  const client = algoliasearch(
    siteConfig('ALGOLIA_APP_ID'),
    siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY')
  )
  const index = client.initIndex(siteConfig('ALGOLIA_INDEX'))

  /**
   * 搜索
   * @param {*} query
   */
  const handleSearch = async (query, page) => {
    setKeyword(query)
    setPage(page)
    setSearchResults([])
    setUseTime(0)
    setTotalPage(0)
    setTotalHit(0)
    setActiveIndex(0)
    if (!query || query === '') {
      return
    }
    setIsLoading(true)
    try {
      const res = await index.search(query, { page, hitsPerPage: 10 })
      const { hits, nbHits, nbPages, processingTimeMS } = res
      setUseTime(processingTimeMS)
      setTotalPage(nbPages)
      setTotalHit(nbHits)
      setSearchResults(hits)
      setIsLoading(false)
      const doms = document
        .getElementById('search-wrapper')
        .getElementsByClassName('replace')

      setTimeout(() => {
        replaceSearchResult({
          doms,
          search: query,
          target: {
            element: 'span',
            className: 'font-bold border-b border-dashed'
          }
        })
      }, 200) // 延时高亮
    } catch (error) {
      console.error('Algolia search error:', error)
    }
  }

  // 定义节流函数，确保在用户停止输入一段时间后才会调用处理搜索的方法
  const throttledHandleInputChange = useRef(
    throttle((query, page = 0) => {
      handleSearch(query, page)
    }, 1000)
  )

  // 用于存储搜索延迟的计时器
  const searchTimer = useRef(null)

  // 修改input的onChange事件处理函数
  const handleInputChange = e => {
    const query = e.target.value

    // 如果已经有计时器在等待搜索，先清除之前的计时器
    if (searchTimer.current) {
      clearTimeout(searchTimer.current)
    }

    // 设置新的计时器，在用户停止输入一段时间后触发搜索
    searchTimer.current = setTimeout(() => {
      throttledHandleInputChange.current(query)
    }, 800)
  }

  /**
   * 切换页码
   * @param {*} page
   */
  const switchPage = page => {
    throttledHandleInputChange.current(keyword, page)
  }

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (!siteConfig('ALGOLIA_APP_ID')) {
    return <></>
  }
  const modalContent = (
    <div
      id='search-wrapper'
      className={`${
        isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'
      } heo-search-modal fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-transparent px-3 py-3 sm:px-4 sm:py-[10vh]`}>
      {/* 遮罩 */}
      <div
        onClick={closeModal}
        className='heo-search-modal__backdrop absolute inset-0 z-0 bg-slate-950/18 backdrop-blur-[6px] dark:bg-black/45'
      />

      {/* 模态框 */}
      <div
        className={`${
          isModalOpen ? 'opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-6'
        } heo-search-modal__panel relative z-10 flex min-h-[10rem] w-full max-w-xl flex-col justify-between rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_64px_rgba(15,23,42,0.16)] backdrop-blur-xl duration-300 transition-all hover:border-blue-300 dark:border-white/10 dark:bg-[#111318]/88 dark:shadow-[0_24px_72px_rgba(0,0,0,0.45)] sm:max-h-[80vh] sm:rounded-[1.5rem] sm:p-5`}>
        <div className='flex justify-between items-center gap-3'>
          <div className='heo-search-modal__title text-2xl text-blue-600 dark:text-yellow-600 font-bold'>
            搜索
          </div>
          <button
            type='button'
            aria-label='关闭搜索'
            className='heo-search-modal__close inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-gray-300 dark:hover:border-yellow-500/50 dark:hover:text-yellow-400'
            onClick={closeModal}>
            <i className='fa-solid fa-xmark' />
          </button>
        </div>

        <input
          type='text'
          placeholder='在这里输入搜索关键词...'
          onChange={e => handleInputChange(e)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className='heo-search-modal__input text-black dark:text-gray-200 bg-slate-50/90 dark:bg-white/5 outline-blue-500 w-full px-4 my-2 py-2.5 mb-4 border border-slate-200/80 dark:border-white/10 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500'
          ref={inputRef}
        />

        {/* 标签组 */}
        <div className='heo-search-modal__tags mb-4'>
          <TagGroups />
        </div>
        {searchResults.length === 0 && keyword && !isLoading && (
          <div className='heo-search-modal__empty'>
            <p className='heo-search-modal__empty-text text-slate-600 text-center my-4 text-base'>
              无法找到相关结果
              <span className='font-semibold'>&quot;{keyword}&quot;</span>
            </p>
          </div>
        )}
        <ul className='heo-search-modal__results min-h-0 flex-1 overflow-y-auto'>
          {searchResults.map((result, index) => (
            <li
              key={result.objectID}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => onJumpSearchResult(index)}
              className={`heo-search-modal__result-item cursor-pointer replace my-2 rounded-xl border p-3 duration-100 ${
                activeIndex === index ? 'is-active bg-blue-600 dark:bg-yellow-600' : ''
              }`}>
              <div className='heo-search-modal__result-head flex items-start justify-between gap-3'>
                <div className='min-w-0 flex-1'>
                  <a
                    className={`heo-search-modal__result-link block ${activeIndex === index ? ' text-white' : ' text-black dark:text-gray-300 '}`}>
                    {result.title}
                  </a>
                  {result.summary && (
                    <p
                      className={`heo-search-modal__result-summary mt-1 line-clamp-2 text-sm ${
                        activeIndex === index ? 'text-white/80 dark:text-black/75' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                      {result.summary}
                    </p>
                  )}
                </div>
                {(result.category || result.tags?.length > 0) && (
                  <div className='heo-search-modal__result-meta hidden shrink-0 flex-col items-end gap-1 sm:flex'>
                    {result.category && (
                      <span
                        className={`heo-search-modal__result-category ${
                          activeIndex === index ? 'text-white/90 dark:text-black/75' : ''
                        }`}>
                        {result.category}
                      </span>
                    )}
                    {result.tags?.length > 0 && (
                      <span
                        className={`heo-search-modal__result-tags ${
                          activeIndex === index ? 'text-white/75 dark:text-black/65' : ''
                        }`}>
                        #{result.tags.slice(0, 2).join(' · #')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Pagination totalPage={totalPage} page={page} switchPage={switchPage} />
        <div className='heo-search-modal__footer mt-3 flex flex-col gap-3 border-t border-slate-200/70 pt-3 text-xs text-gray-600 dark:border-white/10 dark:text-gray-300 sm:mt-2 sm:flex-row sm:items-center sm:justify-between sm:text-sm'>
          {totalHit === 0 && (
            <div className='hidden items-center sm:flex'>
              {ShortCutActions.map((action, index) => {
                return (
                  <Fragment key={index}>
                    <div className='heo-search-modal__shortcut border-gray-300 dark:text-gray-300 text-gray-600 px-2 rounded border inline-block'>
                      {action.key}
                    </div>
                    <span className='ml-2 mr-4 text-gray-600 dark:text-gray-300'>
                      {action.action}
                    </span>
                  </Fragment>
                )
              })}
            </div>
          )}
          <div className='sm:flex-1 sm:text-center'>
            {totalHit > 0 ? (
              <p>
                共搜索到 {totalHit} 条结果，用时 {useTime} 毫秒
              </p>
            ) : (
              <p className='sm:hidden'>输入关键词开始搜索</p>
            )}
          </div>
          <div className='heo-search-modal__brand text-left sm:text-right'>
            <span>
              <i className='fa-brands fa-algolia'></i> Algolia 提供搜索服务
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

/**
 * 标签组
 */
function TagGroups() {
  const { tagOptions } = useGlobal()
  //  获取tagOptions数组前十个
  const firstTenTags = tagOptions?.slice(0, 10)

  return (
    <div id='tags-group' className='dark:border-gray-700 space-y-2'>
      {firstTenTags?.map((tag, index) => {
        return (
          <SmartLink
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'cursor-pointer inline-block whitespace-nowrap'}>
            <div
              className={
                'flex items-center text-black dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-yellow-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all'
              }>
              <div className='text-lg'>{tag.name} </div>
              {tag.count ? (
                <sup className='relative ml-1'>{tag.count}</sup>
              ) : (
                <></>
              )}
            </div>
          </SmartLink>
        )
      })}
    </div>
  )
}

/**
 * 分页
 * @param {*} param0
 */
function Pagination(props) {
  const { totalPage, page, switchPage } = props
  if (totalPage <= 0) {
    return <></>
  }
  return (
    <div className='flex space-x-1 w-full justify-center py-1'>
      {Array.from({ length: totalPage }, (_, i) => {
        const classNames =
          page === i
            ? 'font-bold text-white bg-blue-600 dark:bg-yellow-600 rounded'
            : 'hover:text-blue-600 hover:font-bold dark:text-gray-300'

        return (
          <div
            onClick={() => switchPage(i)}
            className={`text-center cursor-pointer w-6 h-6 ${classNames}`}
            key={i}>
            {i + 1}
          </div>
        )
      })}
    </div>
  )
}
