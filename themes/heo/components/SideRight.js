import Live2D from '@/components/Live2D'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { AnalyticsCard } from './AnalyticsCard'
import Card from './Card'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import LatestPostsGroupMini from './LatestPostsGroupMini'
import TagGroups from './TagGroups'
import TouchMeCard from './TouchMeCard'

const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const { post, tagOptions, currentTag, rightAreaSlot } = props
  const { locale, isDarkMode } = useGlobal()

  // 只摘取标签的前60个，防止右侧过长
  const sortedTags = tagOptions?.slice(0, 60) || []

  const sectionTitleStyle = {
    color: isDarkMode ? 'var(--heo-card-title-dark)' : 'var(--heo-card-title)'
  }

  const sectionLabelStyle = {
    color: isDarkMode ? 'var(--heo-card-muted-dark)' : 'var(--heo-card-muted)'
  }

  const dividerStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.32)' : 'rgba(226,232,240,0.9)'
  }

  const subSectionStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.24)' : 'rgba(226,232,240,0.82)',
    background: isDarkMode ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.5)'
  }

  const subSectionTitleStyle = {
    color: isDarkMode ? '#E2E8F0' : '#334155'
  }

  const subSectionLabelStyle = {
    color: isDarkMode ? '#64748B' : '#94A3B8'
  }

  return (
    <div id='sideRight' className='hidden xl:block h-full w-72 space-y-4'>
      <InfoCard {...props} className='w-72 wow fadeInUp' />

      <div className='heo-side-right-sticky sticky top-20 space-y-4'>
        {/* 文章页显示目录 */}
        {post && post.toc && post.toc.length > 0 && (
          <Card
            className='heo-card--interactive heo-toc-card wow fadeInUp rounded-[1.75rem] border p-4 backdrop-blur-xl'>
            <div className='heo-toc-card__header mb-3 px-1'>
              <div
                style={sectionLabelStyle}
                className='heo-toc-card__eyebrow text-[11px] font-semibold uppercase tracking-[0.24em]'>
                Article
              </div>
              <div style={sectionTitleStyle} className='heo-toc-card__title mt-1 text-lg font-semibold'>
                {locale.COMMON.TABLE_OF_CONTENTS}
              </div>
            </div>
            <Catalog toc={post.toc} showHeader={false} />
          </Card>
        )}


        {/* 联系交流群 */}
        <div className='wow fadeInUp'>
          <TouchMeCard />
        </div>

        {/* 最新文章列表 */}
        <Card
          className='heo-card--interactive wow fadeInUp hidden rounded-[1.75rem] border p-4 backdrop-blur-xl lg:block'>
          <div className='mb-3 px-1'>
            <div
              style={sectionLabelStyle}
              className='text-[11px] font-semibold uppercase tracking-[0.24em]'>
              Feed
            </div>
            <div style={sectionTitleStyle} className='mt-1 text-lg font-semibold'>
              {locale.COMMON.LATEST_POSTS}
            </div>
          </div>
          <div className='max-h-[20rem] overflow-y-auto pr-1 scroll-hidden'>
            <LatestPostsGroupMini {...props} showHeader={false} maxItems={4} />
          </div>
        </Card>

        {rightAreaSlot}

        <FaceBookPage />
        <Live2D />

        {/* 标签和成绩 */}
        <Card className='heo-card--interactive wow fadeInUp rounded-[1.75rem] border p-4 backdrop-blur-xl'>
          <div className='mb-4 px-1'>
            <div
              style={sectionLabelStyle}
              className='text-[11px] font-semibold uppercase tracking-[0.24em]'>
              Discover
            </div>
            <div style={sectionTitleStyle} className='mt-1 text-lg font-semibold'>
              {locale.COMMON.TAGS}
            </div>
          </div>

          <div
            style={subSectionStyle}
            className='rounded-[1.35rem] border px-3 py-3 backdrop-blur-sm'>
            <div className='mb-3 px-1'>
              <div
                style={subSectionLabelStyle}
                className='text-[10px] font-semibold uppercase tracking-[0.22em]'>
                Browse
              </div>
              <div style={subSectionTitleStyle} className='mt-1 text-sm font-semibold'>
                标签导航
              </div>
            </div>
            <TagGroups tags={sortedTags} currentTag={currentTag} isDarkMode={isDarkMode} />
          </div>

          <hr style={dividerStyle} className='relative mx-1 my-4 flex border-dashed opacity-80' />

          <div
            style={subSectionStyle}
            className='rounded-[1.35rem] border px-3 py-3 backdrop-blur-sm'>
            <div className='mb-3 px-1'>
              <div
                style={subSectionLabelStyle}
                className='text-[10px] font-semibold uppercase tracking-[0.22em]'>
                Snapshot
              </div>
              <div style={subSectionTitleStyle} className='mt-1 text-sm font-semibold'>
                站点统计
              </div>
            </div>
            <AnalyticsCard {...props} />
          </div>
        </Card>
      </div>
    </div>
  )
}
