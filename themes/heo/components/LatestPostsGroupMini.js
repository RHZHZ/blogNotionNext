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
export default function LatestPostsGroupMini({ latestPosts, showHeader = true, maxItems }) {
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

          return (
            <SmartLink
              key={post.id}
              title={post.title}
              href={post?.href}
              passHref
              className={`heo-mini-post-card flex min-h-[3.35rem] items-start gap-0 rounded-xl px-1.5 py-1.5 transition-all duration-200 ${selected ? 'is-active' : ''}`}>
              <div className='min-w-0 flex-1'>
                <div className='heo-mini-post-card__title line-clamp-2 text-[13px] font-medium leading-5'>
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
