import LazyImage from '@/components/LazyImage'
import AboutSectionHeading from './AboutSectionHeading'

const getCardStyle = card => {
  if (!card?.image) return undefined

  if (card.type === 'hobby') {
    return {
      backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.18), rgba(3, 7, 18, 0.5)), url(${card.image})`
    }
  }

  if (card.type === 'reading') {
    return {
      backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.16), rgba(3, 7, 18, 0.46)), url(${card.image})`
    }
  }

  return undefined
}

const StandardCard = ({ card }) => {
  if (!card) return null

  return (
    <article
      className={`heo-about-profile-card heo-about-profile-card--${card.type || 'default'} heo-about-persona-layout__card heo-about-persona-layout__card--${card.type || 'default'}`}
      style={getCardStyle(card)}>
      <div className='heo-about-profile-card__content'>
        <div className='heo-about-profile-card__eyebrow'>{card.eyebrow}</div>
        <div className='heo-about-profile-card__title-row'>
          <div>
            <div className='heo-about-profile-card__title'>{card.title}</div>
            <div className='heo-about-profile-card__accent'>{card.accent}</div>
          </div>
          {card.badge ? <div className='heo-about-profile-card__badge'>{card.badge}</div> : null}
        </div>
        <div className='heo-about-profile-card__description'>{card.description}</div>
      </div>

      {card.type === 'personality' && card.image ? (
        <div className='heo-about-profile-card__media'>
          <LazyImage
            src={card.image}
            alt={card.imageAlt || card.title}
            width={220}
            height={180}
            className='heo-about-profile-card__image'
          />
        </div>
      ) : null}

      {/* {card.type === 'reading' ? (
        <div className='heo-about-profile-card__media heo-about-profile-card__media--reading' aria-hidden='true'>
          <div className='heo-about-profile-card__reading-icon'>读</div>
        </div>
      ) : null} */}
    </article>
  )
}

const CreativeCard = ({ skills }) => {
  const creativeTags = (skills || [])
    .filter(item => ['吉他', 'FL Studio', '音乐人'].includes(item?.name))
    .slice(0, 3)

  return (
    <article className='heo-about-persona-layout__card heo-about-persona-layout__card--creative'>
      <div className='heo-about-persona-layout__creative-copy'>
        <div className='heo-about-persona-layout__creative-eyebrow'>创作角落</div>
        <div className='heo-about-persona-layout__creative-title'>吉他 / 编曲 / 长期表达</div>
        <div className='heo-about-persona-layout__creative-desc'>纯属爱好，也确实菜得可以种菜</div>
        <div className='heo-about-persona-layout__creative-tags'>
          {creativeTags.map(item => (
            <span key={item.name} className='heo-about-persona-layout__creative-tag'>
              {item.name}
            </span>
          ))}
        </div>
      </div>

      <div
        className='heo-about-persona-layout__creative-figure'
        aria-hidden='true'
        style={{ '--heo-about-creative-image': "url('/images/about/guitar-card.jpg')" }}
      />
    </article>
  )
}



const AnimeCard = ({ card }) => {
  if (!card) return null

  return (
    <article className='heo-about-persona-layout__card heo-about-persona-layout__card--anime'>
      <div className='heo-about-profile-card__combo-anime'>
        {card.animeCovers?.map(item => (
          <div key={item.title} className='heo-about-profile-card__combo-anime-item'>
            <LazyImage src={item.image} alt={item.title} width={180} height={280} className='heo-about-profile-card__combo-anime-image' />
            <span className='heo-about-profile-card__combo-anime-label'>{item.title}</span>
          </div>
        ))}
        <div className='heo-about-profile-card__combo-anime-overlay'>
          <div className='heo-about-profile-card__combo-anime-eyebrow'>{card.eyebrow}</div>
          <div className='heo-about-profile-card__combo-anime-title'>{card.title}</div>
          <div className='heo-about-profile-card__combo-anime-subtitle'>{card.animeTitle || card.accent}</div>
        </div>
      </div>
    </article>
  )
}

const MusicCard = ({ card }) => {
  if (!card) return null

  return (
    <article className='heo-about-persona-layout__card heo-about-persona-layout__card--music'>
      <div className='heo-about-profile-card__combo-music'>
        <LazyImage src={card.image} alt={card.title} width={360} height={320} className='heo-about-profile-card__combo-music-image' />
        <div className='heo-about-profile-card__combo-music-overlay'>
          <div>
            <div className='heo-about-profile-card__combo-music-eyebrow'>{card.eyebrow}</div>
            <div className='heo-about-profile-card__combo-music-title'>{card.title}</div>
            <div className='heo-about-profile-card__combo-music-subtitle'>{card.subtitle}</div>
          </div>
          <div className='heo-about-profile-card__combo-music-desc'>{card.description}</div>
        </div>
      </div>
    </article>
  )
}

const AboutPersona = ({ cards, skills = [] }) => {
  const personalityCard = cards.find(card => card.type === 'personality')
  const hobbyCard = cards.find(card => card.type === 'hobby')
  const readingCard = cards.find(card => card.type === 'reading')
  const fandomCard = cards.find(card => card.type === 'fandom-music')

  const animeCard = fandomCard
    ? {
        type: 'anime',
        eyebrow: fandomCard.eyebrow,
        title: fandomCard.title,
        accent: fandomCard.accent,
        animeTitle: fandomCard.animeTitle,
        animeCovers: fandomCard.animeCovers,
        description: fandomCard.description
      }
    : null

  const musicCard = fandomCard?.musicPanel
    ? {
        type: 'music',
        ...fandomCard.musicPanel
      }
    : null

  return (
    <section className='heo-about-section heo-about-section--persona heo-card'>
      <div className='heo-card__body'>
        <AboutSectionHeading
          eyebrow='个性切片'
          title='个性与兴趣'
          description='喜欢尝试新东西，也喜欢把真正在意的部分长期保留下来'
        />

        <div className='heo-about-persona-layout'>
          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--personality'>
            <StandardCard card={personalityCard} />
          </div>
          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--creative'>
            <CreativeCard skills={skills} />
          </div>

          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--hobby'>
            <StandardCard card={hobbyCard} />
          </div>
          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--reading'>
            <StandardCard card={readingCard} />
          </div>
          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--anime'>
            <AnimeCard card={animeCard} />
          </div>
          <div className='heo-about-persona-layout__slot heo-about-persona-layout__slot--music'>
            <MusicCard card={musicCard} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPersona
