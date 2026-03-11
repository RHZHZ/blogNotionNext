import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post }) => {
  if (post?.blockMap) {
    return (
      <div>
        {post && (
          <div id='announcement-content'>
            <NotionPage post={post} />
          </div>
        )}
      </div>
    )
  }
  return <></>
}

export default Announcement
