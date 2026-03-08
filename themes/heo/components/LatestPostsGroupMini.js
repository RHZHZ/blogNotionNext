import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
export default function LatestPostsGroupMini({ latestPosts, siteInfo, showHeader = true, maxItems }) {
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()
  const SUB_PATH = siteConfig('SUB_PATH', '')
  const posts = typeof maxItems === 'number' ? latestPosts?.slice(0, maxItems) : latestPosts

  return posts ? (
    <>
      {showHeader && (
        <div className='mb-2 flex flex-nowrap justify-between px-1'>
          <div>
            <i className='mr-2 fas fas fa-history' />
            {locale.COMMON.LATEST_POSTS}
          </div>
        </div>
      )}
      <div className='space-y-2'>
        {posts.map(post => {
          const selected = currentPath === `${SUB_PATH}/${post.slug}`
          const headerImage = post?.pageCoverThumbnail
            ? post.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <SmartLink
              key={post.id}
              title={post.title}
              href={post?.href}
              passHref
              className={`heo-mini-post-card flex min-h-[4.25rem] items-center gap-3 rounded-2xl border px-2.5 py-2 transition-all duration-200 ${selected ? 'is-active' : ''}`}>
              <div className='heo-mini-post-card__cover relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-white/40 dark:border-white/10'>
                <LazyImage
                  src={`${headerImage}`}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='heo-mini-post-card__title truncate text-[13px] font-medium leading-5'>
                  {post.title}
                </div>
                <div className='heo-mini-post-card__date mt-1 text-[11px]'>
                  {post.lastEditedDay}
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  ) : null
}
