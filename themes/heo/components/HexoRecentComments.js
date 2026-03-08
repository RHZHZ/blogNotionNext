import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { RecentComments } from '@waline/client'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const HexoRecentComments = props => {
  const [comments, updateComments] = useState([])
  const { locale } = useGlobal()
  const [onLoading, changeLoading] = useState(true)
  useEffect(() => {
    RecentComments({
      serverURL: siteConfig('COMMENT_WALINE_SERVER_URL'),
      count: 5
    }).then(({ comments }) => {
      changeLoading(false)
      updateComments(comments)
    })
  }, [])

  return (
    <section className='heo-card heo-card--interactive heo-recent-comments-card lg:p-6 p-4'>
      <div className='mb-2 flex items-center px-1 text-sm font-semibold text-slate-800 dark:text-slate-100'>
        <i className='mr-2 fas fa-comment text-[0.95rem]' />
        {locale.COMMON.RECENT_COMMENTS}
      </div>

      {onLoading && (
        <div className='px-1 text-sm text-slate-500 dark:text-slate-300'>
          Loading...
          <i className='ml-2 fas fa-spinner animate-spin' />
        </div>
      )}
      {!onLoading && comments && comments.length === 0 && (
        <div className='px-1 text-sm text-slate-500 dark:text-slate-300'>No Comments</div>
      )}
      {!onLoading &&
        comments &&
        comments.length > 0 &&
        comments.map(comment => (
          <div key={comment.objectId} className='pb-2 pl-1'>
            <div
              className='waline-recent-content wl-content text-sm text-slate-700 dark:text-slate-200'
              dangerouslySetInnerHTML={{ __html: comment.comment }}
            />
            <div className='pt-1 pr-2 text-right text-sm text-slate-400 transition-colors duration-200 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400'>
              <SmartLink
                href={{
                  pathname: comment.url,
                  hash: comment.objectId,
                  query: { target: 'comment' }
                }}>
                --{comment.nick}
              </SmartLink>
            </div>
          </div>
        ))}
    </section>
  )
}

export default HexoRecentComments
