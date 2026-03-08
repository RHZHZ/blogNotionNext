import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)

  function handleSearch() {
    if (siteConfig('SEARCH_ENGINE') === 'algolia' && siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={handleSearch}
        aria-label={locale.NAV.SEARCH}
        title={locale.NAV.SEARCH}
        className='heo-header-action-btn'>
        <i title={locale.NAV.SEARCH} className='fa-solid fa-magnifying-glass' />
      </button>
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </>
  )
}
