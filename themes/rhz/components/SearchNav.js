import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useEffect, useRef } from 'react'
import SearchInput from './SearchInput'

export default function SearchNav(props) {
  const { tagOptions, categoryOptions } = props
  const cRef = useRef(null)
  const { locale, isDarkMode } = useGlobal()

  useEffect(() => {
    cRef?.current?.focus()
  }, [])

  const shellStyle = {
    background: isDarkMode ? 'rgba(15,23,42,0.42)' : 'rgba(255,255,255,0.52)'
  }

  const heroStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.32)' : 'rgba(226,232,240,0.9)',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(15,23,42,0.92), rgba(17,24,39,0.82))'
      : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))',
    boxShadow: isDarkMode ? '0 20px 48px rgba(0,0,0,0.18)' : '0 20px 48px rgba(15,23,42,0.08)'
  }

  const panelStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.32)' : 'rgba(226,232,240,0.9)',
    background: isDarkMode ? 'rgba(15,23,42,0.74)' : 'rgba(255,255,255,0.88)',
    boxShadow: isDarkMode ? 'none' : '0 12px 30px rgba(15,23,42,0.06)'
  }

  const eyebrowStyle = {
    color: isDarkMode ? '#94A3B8' : '#64748B'
  }

  const titleStyle = {
    color: isDarkMode ? '#F8FAFC' : '#0F172A'
  }

  const descStyle = {
    color: isDarkMode ? '#CBD5E1' : '#64748B'
  }

  const chipStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.36)' : 'rgba(226,232,240,0.92)',
    background: isDarkMode ? 'rgba(30,41,59,0.78)' : 'rgba(255,255,255,0.96)',
    color: isDarkMode ? '#CBD5E1' : '#475569'
  }

  const iconChipStyle = {
    borderColor: isDarkMode ? 'rgba(96,165,250,0.22)' : 'rgba(191,219,254,0.88)',
    background: isDarkMode ? 'rgba(30,58,138,0.18)' : 'rgba(239,246,255,0.92)',
    color: isDarkMode ? '#BFDBFE' : '#4F46E5'
  }

  const itemCountStyle = {
    color: isDarkMode ? '#94A3B8' : '#64748B'
  }

  return (
    <div className='my-6 px-2'>
      <div
        style={shellStyle}
        className='rounded-[2rem] p-1 backdrop-blur-xl md:p-2'>
        <div
          style={heroStyle}
          className='rounded-[1.75rem] border px-4 py-5 md:px-6 md:py-6'>
          <div className='flex flex-col gap-5'>
            <div className='space-y-2'>
              <div
                style={eyebrowStyle}
                className='text-[11px] font-semibold uppercase tracking-[0.28em]'>
                HEO SEARCH
              </div>
              <div
                style={titleStyle}
                className='text-2xl font-bold md:text-[2rem]'>
                {locale.SEARCH.ARTICLES}
              </div>
              <p style={descStyle} className='max-w-2xl text-sm leading-7 md:text-[15px]'>
                直接搜索文章，也可以从分类和标签快速进入你感兴趣的内容。
              </p>
            </div>

            <div
              style={panelStyle}
              className='rounded-[1.5rem] border p-3 backdrop-blur-xl md:p-4'>
              <SearchInput cRef={cRef} {...props} />
            </div>
          </div>
        </div>

        <div className='mt-4 grid gap-4 lg:grid-cols-2'>
          <section
            style={panelStyle}
            className='rounded-[1.75rem] border p-4 backdrop-blur-xl md:p-5'>
            <div className='mb-4 flex items-center gap-3'>
              <div
                style={iconChipStyle}
                className='flex h-10 w-10 items-center justify-center rounded-2xl border'>
                <i className='fas fa-folder text-sm' />
              </div>
              <div>
                <div
                  style={eyebrowStyle}
                  className='text-[11px] font-semibold uppercase tracking-[0.22em]'>
                  Browse
                </div>
                <div style={titleStyle} className='text-lg font-semibold'>
                  {locale.COMMON.CATEGORY}
                </div>
              </div>
            </div>

            <div id='category-list' className='flex flex-wrap gap-2'>
              {categoryOptions?.map(category => (
                <SmartLink
                  key={category.name}
                  href={`/category/${category.name}`}
                  style={chipStyle}
                  className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5'>
                  <i className='fas fa-folder text-xs opacity-80' />
                  <span className='truncate'>{category.name}</span>
                  <span style={itemCountStyle} className='text-xs font-semibold'>
                    {category.count}
                  </span>
                </SmartLink>
              ))}
            </div>
          </section>

          <section
            style={panelStyle}
            className='rounded-[1.75rem] border p-4 backdrop-blur-xl md:p-5'>
            <div className='mb-4 flex items-center gap-3'>
              <div
                style={iconChipStyle}
                className='flex h-10 w-10 items-center justify-center rounded-2xl border'>
                <i className='fas fa-hashtag text-sm' />
              </div>
              <div>
                <div
                  style={eyebrowStyle}
                  className='text-[11px] font-semibold uppercase tracking-[0.22em]'>
                  Explore
                </div>
                <div style={titleStyle} className='text-lg font-semibold'>
                  {locale.COMMON.TAGS}
                </div>
              </div>
            </div>

            <div id='tags-list' className='flex flex-wrap gap-2'>
              {tagOptions?.map(tag => (
                <SmartLink
                  key={tag.name}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  style={chipStyle}
                  className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5'>
                  <i className='fas fa-hashtag text-[11px] opacity-80' />
                  <span className='truncate'>{tag.name}</span>
                  {tag.count ? (
                    <span style={itemCountStyle} className='text-xs font-semibold'>
                      {tag.count}
                    </span>
                  ) : null}
                </SmartLink>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
