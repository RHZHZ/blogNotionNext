const AboutSectionHeading = ({ eyebrow, title, description, extra }) => {
  return (
    <div className='heo-about-section-heading'>
      <div>
        <div className='heo-about-section-heading__eyebrow'>{eyebrow}</div>
        <h2 className='heo-about-section-heading__title'>{title}</h2>
        {description ? <p className='heo-about-section-heading__desc'>{description}</p> : null}
      </div>
      {extra ? <div className='heo-about-section-heading__extra'>{extra}</div> : null}
    </div>
  )
}

export default AboutSectionHeading
