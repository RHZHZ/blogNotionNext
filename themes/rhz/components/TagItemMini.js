import { HashTag } from '@/components/HeroIcons'
import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={`rhz-tag-mini heo-tag-mini ${selected ? 'is-active' : ''} inline-flex cursor-pointer items-center rounded-2xl px-2.5 py-1 text-sm whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:-translate-y-0.5`}>
      <div className='rhz-tag-mini__content heo-tag-mini__content font-light flex items-center'>
        <HashTag className='rhz-tag-mini__icon heo-tag-mini__icon stroke-2 mr-0.5 w-3 h-3' />
        <span className='rhz-tag-mini__label heo-tag-mini__label'>{tag.name + (tag.count ? `(${tag.count})` : '')}</span>
      </div>
    </SmartLink>
  )
}

export default TagItemMini
