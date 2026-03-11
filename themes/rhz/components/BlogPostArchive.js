import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle, siteInfo }) => {
  if (!posts || posts.length === 0) {
    return <></>
  } else {
    return (
      <section className='heo-archive-group'>
        <header className='heo-archive-group__header' id={archiveTitle}>
          <div className='heo-archive-group__eyebrow'>Archive</div>
          <div className='heo-archive-group__title'>{archiveTitle}</div>
        </header>
        <ul className='heo-archive-group__list'>
          {posts?.map(post => {
            const showPreview =
              siteConfig('RHZ_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
            if (
              post &&
              !post.pageCoverThumbnail &&
              siteConfig('RHZ_POST_LIST_COVER_DEFAULT', null, CONFIG)
            ) {
              post.pageCoverThumbnail = siteInfo?.pageCover
            }
            const showPageCover =
              siteConfig('RHZ_POST_LIST_COVER', null, CONFIG) &&
              post?.pageCoverThumbnail &&
              !showPreview
            return (
              <li key={post.id} className='heo-archive-item'>
                <article className='heo-archive-card group'>
                  {showPageCover && (
                    <SmartLink href={post?.href} passHref legacyBehavior>
                      <div className='heo-archive-card__cover-wrap'>
                        <LazyImage
                          className='heo-archive-card__cover'
                          src={post?.pageCoverThumbnail}
                        />
                      </div>
                    </SmartLink>
                  )}

                  <div className='heo-archive-card__content'>
                    <div className='heo-archive-card__main'>
                      {post?.category && (
                        <div
                          className={`heo-archive-card__meta ${showPreview ? 'justify-center' : 'justify-start'} hidden md:block flex-wrap`}>
                          <SmartLink
                            passHref
                            href={`/category/${post.category}`}
                            className='heo-archive-card__category cursor-pointer text-xs font-normal menu-link'>
                            {post.category}
                          </SmartLink>
                        </div>
                      )}

                      <SmartLink
                        href={post?.href}
                        passHref
                        className='heo-archive-card__title replace line-clamp-2 cursor-pointer text-xl font-extrabold leading-tight'>
                        <span className='menu-link'>{post.title}</span>
                      </SmartLink>
                    </div>

                    <div className='heo-archive-card__tags'>
                      <div className='heo-archive-card__tags-inner'>
                        {post.tagItems?.map(tag => (
                          <TagItemMini key={tag.name} tag={tag} />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }
}

export default BlogPostArchive
