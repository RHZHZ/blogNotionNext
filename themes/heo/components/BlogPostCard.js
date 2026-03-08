import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  if (
    post &&
    !post.pageCoverThumbnail &&
    siteConfig('HEO_POST_LIST_COVER_DEFAULT', null, CONFIG)
  ) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('HEO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  const POST_TWO_COLS = siteConfig('HEO_HOME_POST_TWO_COLS', true, CONFIG)
  const COVER_HOVER_ENLARGE = siteConfig(
    'HEO_POST_LIST_COVER_HOVER_ENLARGE',
    true,
    CONFIG
  )

  return (
    <article className={COVER_HOVER_ENLARGE ? 'hover:transition-all duration-150' : ''}>
      <div
        data-wow-delay='.2s'
        className={
          (POST_TWO_COLS ? '2xl:h-96 2xl:flex-col' : '') +
          ' heo-post-card heo-card heo-card--interactive group wow fadeInUp mb-4 flex h-[23rem] w-full flex-col justify-between overflow-hidden md:h-52 md:flex-row'
        }>
        {showPageCover && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div
              className={
                (POST_TWO_COLS ? ' 2xl:w-full' : '') +
                ' heo-post-card__cover w-full cursor-pointer select-none overflow-hidden aspect-[16/9] md:h-full md:w-5/12 md:aspect-auto'
              }>
              <LazyImage
                priority={index === 0}
                src={post?.pageCoverThumbnail}
                alt={post?.title}
                className='h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-90'
              />
            </div>
          </SmartLink>
        )}

        <div
          className={
            (POST_TWO_COLS ? '2xl:p-4 2xl:h-48 2xl:w-full' : '') +
            ' heo-post-card__content flex h-48 w-full flex-col justify-between p-6 md:h-full md:w-7/12'
          }>
          <header className='heo-post-card__header'>
            {post?.category && (
              <div
                className={`heo-post-card__meta flex mb-1 items-center ${showPreview ? 'justify-center' : 'justify-start'} hidden flex-wrap md:block`}>
                <SmartLink
                  passHref
                  href={`/category/${post.category}`}
                  className='heo-post-card__category cursor-pointer text-xs font-normal menu-link'>
                  {post.category}
                </SmartLink>
              </div>
            )}

            <SmartLink
              href={post?.href}
              passHref
              className='heo-post-card__title group-hover:text-indigo-700 dark:hover:text-yellow-700 dark:group-hover:text-yellow-600 replace line-clamp-2 cursor-pointer text-xl font-extrabold leading-tight'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon
                  icon={post.pageIcon}
                  className='heo-icon mr-1 inline-block h-6 w-6 align-middle translate-y-[-8%]'
                />
              )}
              <span className='menu-link'>{post.title}</span>
            </SmartLink>
          </header>

          {(!showPreview || showSummary) && (
            <main className='heo-post-card__summary replace line-clamp-2 text-sm font-light leading-tight'>
              {post.summary}
            </main>
          )}

          <div className='inline-block flex-wrap md:flex-nowrap md:justify-start'>
            <div>
              {post.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
