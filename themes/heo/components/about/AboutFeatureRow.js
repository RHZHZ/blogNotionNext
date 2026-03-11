import SmartLink from '@/components/SmartLink'
import AboutSectionHeading from './AboutSectionHeading'

const AboutContactItem = ({ item }) => {
  if (item?.href) {
    return (
      <SmartLink href={item.href} className='heo-about-contact-item heo-card--interactive'>
        <span className='heo-about-contact-item__label'>{item.label}</span>
        <span className='heo-about-contact-item__value'>{item.value}</span>
      </SmartLink>
    )
  }

  return (
    <div className='heo-about-contact-item'>
      <span className='heo-about-contact-item__label'>{item.label}</span>
      <span className='heo-about-contact-item__value'>{item.value}</span>
    </div>
  )
}

const AboutFeatureRow = ({ highlights, featureCards, timelineSummary, contacts }) => {
  return (
    <div className='heo-about-feature-row'>
      <section className='heo-about-section heo-about-section--focus heo-card'>
        <div className='heo-card__body'>
          <AboutSectionHeading
            eyebrow='Focus'
            title='近期关注'
            description='这里保留最近持续投入的方向，用轻量标签概括当下关注点，并把联系入口独立承接。'
          />

          <div className='heo-about-side-tags'>
            {highlights.map(tag => (
              <span key={tag} className='heo-about-side-tags__item'>
                {tag}
              </span>
            ))}
          </div>

          <div className='heo-about-contact-list'>
            {contacts.map(item => (
              <AboutContactItem key={`${item.label}-${item.value}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      <div className='heo-about-feature-stack'>
        {featureCards.map(card => (
          <section key={card.title} className='heo-about-feature-card heo-card'>
            <div className='heo-card__body'>
              <div className='heo-about-feature-card__eyebrow'>{card.eyebrow}</div>
              <div className='heo-about-feature-card__title'>{card.title}</div>
              <p className='heo-about-feature-card__description'>{card.description}</p>
              {card.tags?.length ? (
                <div className='heo-about-feature-card__tags'>
                  {card.tags.map(tag => (
                    <span key={tag} className='heo-about-feature-card__tag'>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        {timelineSummary?.length ? (
          <section className='heo-about-feature-card heo-about-feature-card--timeline heo-card'>
            <div className='heo-card__body'>
              <AboutSectionHeading
                eyebrow='Timeline'
                title='经历摘要'
                description='这里只保留关键节点摘要，避免与长内容区抢占首屏注意力。'
              />
              <div className='heo-about-timeline'>
                {timelineSummary.map(item => (
                  <div key={`${item.year}-${item.title}`} className='heo-about-timeline__item'>
                    <div className='heo-about-timeline__dot' />
                    <div className='heo-about-timeline__content'>
                      <div className='heo-about-timeline__year'>{item.year}</div>
                      <div className='heo-about-timeline__title'>{item.title}</div>
                      <div className='heo-about-timeline__desc'>{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default AboutFeatureRow
