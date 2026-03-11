import LazyImage from '@/components/LazyImage'

const AboutHero = ({ hero, introduction, stats, author }) => {
  const hasTagline = Boolean(String(hero.tagline || '').trim())

  return (
    <section className='heo-about-hero heo-card'>
      <div className='heo-about-hero__body heo-card__body'>
        <div className='heo-about-hero__avatar-bg' aria-hidden='true'>
          <div className='heo-about-hero__avatar-ring'>
            <LazyImage
              src={hero.avatar}
              alt={author}
              width={240}
              height={240}
              className='heo-about-hero__avatar'
            />
          </div>
        </div>

        <div className='heo-about-hero__main'>
          <span className='heo-about-hero__badge'>{hero.badge}</span>
          <h1 className='heo-about-hero__title'>{hero.title}</h1>
          <p className='heo-about-hero__subtitle'>{hero.subtitle}</p>
          <p className='heo-about-hero__description'>{hero.description}</p>
          {hasTagline ? <div className='heo-about-hero__tagline'>{hero.tagline}</div> : null}
          <p className='heo-about-hero__intro'>{introduction}</p>
        </div>
      </div>

      <div className='heo-about-hero__stats'>
        {stats.map(stat => (
          <div key={stat.label} className='heo-about-stat'>
            <div className='heo-about-stat__value'>{stat.value}</div>
            <div className='heo-about-stat__label'>{stat.label}</div>
            <div className='heo-about-stat__helper'>{stat.helper}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutHero
