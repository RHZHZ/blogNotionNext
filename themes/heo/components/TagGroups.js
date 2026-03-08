import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagGroups = ({ tags, className, accentColor = '#2563EB', isDarkMode = false }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags) return <></>

  const chipStyle = {
    borderColor: isDarkMode
      ? 'rgba(100,116,139,0.3)'
      : `color-mix(in srgb, ${accentColor} 8%, rgba(148,163,184,0.26))`,
    color: isDarkMode ? '#CBD5E1' : '#475569',
    background: isDarkMode
      ? 'rgba(30,41,59,0.78)'
      : 'rgba(255,255,255,0.96)',
    boxShadow: isDarkMode
      ? '0 4px 10px rgba(0,0,0,0.08)'
      : '0 4px 10px rgba(15,23,42,0.035)'
  }

  const selectedStyle = {
    borderColor: isDarkMode
      ? 'rgba(245,158,11,0.28)'
      : 'rgba(191,219,254,0.98)',
    color: isDarkMode ? '#FCD34D' : '#4F46E5',
    background: isDarkMode
      ? 'rgba(180,83,9,0.2)'
      : 'rgba(239,246,255,0.96)',
    boxShadow: isDarkMode
      ? '0 8px 18px rgba(120,53,15,0.16)'
      : '0 8px 18px rgba(59,130,246,0.08)'
  }

  return (
    <div id='tags-group' className='flex flex-wrap gap-2 dark:border-gray-700'>
      {tags.map((tag, index) => {
        const selected = currentTag === tag.name
        return (
          <SmartLink
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            style={selected ? selectedStyle : chipStyle}
            className={`${className || ''} inline-flex cursor-pointer items-center whitespace-nowrap rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(59,130,246,0.07)] hover:text-slate-700 focus:outline-none focus:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-400/40 dark:hover:text-amber-200 dark:hover:shadow-[0_8px_18px_rgba(120,53,15,0.16)] dark:focus-visible:ring-amber-400/30 ${selected ? '' : 'hover:border-slate-300 dark:hover:border-amber-500/25'}`}>
            <span className='truncate'>{tag.name}</span>
            {tag.count ? <sup className='relative ml-1 text-[11px]'>{tag.count}</sup> : <></>}
          </SmartLink>
        )
      })}
    </div>
  )
}

export default TagGroups
