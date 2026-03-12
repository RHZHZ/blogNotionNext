import Comment from '@/components/Comment'
import { siteConfig } from '@/lib/config'
import CONFIG from '../../config'
import { getAboutPageData } from './about.data'
import AboutBooks from './AboutBooks'
import AboutFeatureRow from './AboutFeatureRow'
import AboutHero from './AboutHero'
import AboutPersona from './AboutPersona'
import AboutSectionHeading from './AboutSectionHeading'
import AboutSkills from './AboutSkills'

const AboutPage = ({ post, siteInfo, children }) => {
  const data = getAboutPageData({ post, siteInfo })
  const commentEnable =
    siteConfig('COMMENT_ARTALK_SERVER') ||
    siteConfig('COMMENT_TWIKOO_ENV_ID') ||
    siteConfig('COMMENT_WALINE_SERVER_URL') ||
    siteConfig('COMMENT_VALINE_APP_ID') ||
    siteConfig('COMMENT_GISCUS_REPO') ||
    siteConfig('COMMENT_CUSDIS_APP_ID') ||
    siteConfig('COMMENT_UTTERRANCES_REPO') ||
    siteConfig('COMMENT_GITALK_CLIENT_ID') ||
    siteConfig('COMMENT_WEBMENTION_ENABLE')

  return (
    <div className='heo-about'>
      <AboutHero
        hero={data.hero}
        introduction={data.introduction}
        stats={data.stats}
        author={siteConfig('AUTHOR', 'author', CONFIG)}
      />

      <AboutPersona cards={data.profileCards} skills={data.skills} />
      <AboutSkills skills={data.skills} />

      <AboutFeatureRow
        highlights={data.highlights}
        featureCards={data.featureCards}
        timelineSummary={data.timelineSummary}
        contacts={data.contacts}
      />

      <AboutBooks
        bookShelf={data.bookShelf}
        recentBookShelf={data.recentBookShelf}
        books={data.books}
        recentBooks={data.recentBooks}
        wereadSync={data.wereadSync}
      />

      <section className='heo-about-article-shell heo-card'>
        <div className='heo-card__body'>
          <AboutSectionHeading
            eyebrow='更多内容'
            title='继续往下看'
            description={data.introductionMore || '下面接着放更完整的正文内容，比如更细的自我介绍、项目经历、阶段想法和一些补充说明。'}
          />
          <div className='heo-about-article-content'>{children}</div>
        </div>
      </section>

      {commentEnable && post && (
        <section className='heo-about-comment-shell heo-card'>
          <div className='heo-card__body'>
            <div className='heo-about-comment-shell__header'>
              <div className='heo-about-comment-shell__intro'>
                <AboutSectionHeading
                  eyebrow='Discussion'
                  title='留言板'
                  description='如果你对这里的内容有共鸣、建议，或者只是想打个招呼，都可以在这里留下点什么。'
                />
              </div>
              <div className='heo-about-comment-shell__status'>
                <div className='heo-about-comment-shell__status-label'>当前状态</div>
                <div className='heo-about-comment-shell__status-value'>Giscus 已接入</div>
                <div className='heo-about-comment-shell__status-desc'>基于 GitHub Discussions，滚动到此区域后再按需加载。</div>
              </div>
            </div>
            <div className='heo-about-comment-shell__panel'>
              <Comment
                frontMatter={post}
                className='mt-0'
                variant='heo'
                tabsVariant='comment-heo'
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default AboutPage

