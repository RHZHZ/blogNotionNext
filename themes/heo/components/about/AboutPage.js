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
            eyebrow='Details'
            title='更多介绍'
            description={data.introductionMore || '以下内容继续渲染 Notion 页面正文，适合放更完整的自我介绍、项目细节与补充资料。'}
          />
          <div className='heo-about-article-content'>{children}</div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

