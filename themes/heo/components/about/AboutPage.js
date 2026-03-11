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
            eyebrow='更多内容'
            title='继续往下看'
            description={data.introductionMore || '下面接着放更完整的正文内容，比如更细的自我介绍、项目经历、阶段想法和一些补充说明。'}
          />
          <div className='heo-about-article-content'>{children}</div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

