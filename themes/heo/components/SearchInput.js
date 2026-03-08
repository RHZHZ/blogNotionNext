import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'
let lock = false

const SearchInput = props => {
  const { currentSearch, cRef, className } = props
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  const { locale } = useGlobal()
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      router.push({ pathname: '/search/' + key }).then(r => {
        setLoadingState(false)
      })
      // location.href = '/search/' + key
    } else {
      router.push({ pathname: '/' }).then(r => {})
    }
  }
  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      // 回车
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) {
      // ESC
      cleanSearch()
    }
  }
  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }

  const [showClean, setShowClean] = useState(false)
  const updateSearchKey = val => {
    if (lock) {
      return
    }
    searchInputRef.current.value = val

    if (val) {
      setShowClean(true)
    } else {
      setShowClean(false)
    }
  }
  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }

  return (
    <div className={`heo-search-input ${className || ''}`}>
      <div className='group relative flex w-full items-center'>
        <input
          ref={searchInputRef}
          type='text'
          className='w-full pl-5 pr-20 text-sm font-light outline-none transition'
          onKeyUp={handleKeyUp}
          onCompositionStart={lockSearchInput}
          onCompositionUpdate={lockSearchInput}
          onCompositionEnd={unLockSearchInput}
          placeholder={locale.SEARCH.ARTICLES}
          onChange={e => updateSearchKey(e.target.value)}
          defaultValue={currentSearch || ''}
        />

        <button
          type='button'
          className='absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 dark:text-slate-300 dark:hover:text-white dark:focus-visible:ring-amber-400/30'
          onClick={handleSearch}
          title={locale.SEARCH.ARTICLES}>
          <i
            className={`fas ${
              onLoading ? 'fa-spinner animate-spin' : 'fa-search'
            }`}
          />
        </button>

        {showClean && (
          <button
            type='button'
            className='absolute right-11 inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 dark:text-slate-400 dark:hover:text-slate-200 dark:focus-visible:ring-amber-400/30'
            onClick={cleanSearch}
            title={locale.COMMON.CLOSE}>
            <i className='fas fa-times' />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput
