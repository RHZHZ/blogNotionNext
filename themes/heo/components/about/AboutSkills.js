import { FaJava, FaGuitar } from 'react-icons/fa'
import {
  SiPremierleague,
  SiCss,
  SiCplusplus,
  SiHtml5,
  SiOpenai,
  SiPython,
  SiVuedotjs,
  SiAudiotechnica
} from 'react-icons/si'
import AboutSectionHeading from './AboutSectionHeading'

const skillIconMap = {
  Java: FaJava,
  Python: SiPython,
  AI: SiOpenai,
  PR: SiPremierleague,
  Vue: SiVuedotjs,
  HTML: SiHtml5,
  CSS: SiCss,
  'C++': SiCplusplus,
  'FL Studio': SiAudiotechnica,
  吉他: FaGuitar
}

const skillThemeMap = {
  Java: { color: '#5382a1', bg: 'linear-gradient(145deg, #f8fafc, #eef2ff)' },
  C: { color: '#2563eb', bg: 'linear-gradient(145deg, #eff6ff, #dbeafe)' },
  'C++': { color: '#2563eb', bg: 'linear-gradient(145deg, #eff6ff, #dbeafe)' },
  Python: { color: '#3776ab', bg: 'linear-gradient(145deg, #fef3c7, #dbeafe)' },
  AI: { color: '#10a37f', bg: 'linear-gradient(145deg, #ecfeff, #dcfce7)' },
  PR: { color: '#9999ff', bg: 'linear-gradient(145deg, #eef2ff, #ede9fe)' },
  Vue: { color: '#42b883', bg: 'linear-gradient(145deg, #ecfdf5, #d1fae5)' },
  HTML: { color: '#e34f26', bg: 'linear-gradient(145deg, #fff7ed, #ffedd5)' },
  CSS: { color: '#1572b6', bg: 'linear-gradient(145deg, #eff6ff, #dbeafe)' },
  'FL Studio': { color: '#f97316', bg: 'linear-gradient(145deg, #fff7ed, #ffedd5)' },
  吉他: { color: '#f59e0b', bg: 'linear-gradient(145deg, #fefce8, #fef3c7)' },
  音乐人: { color: '#ec4899', bg: 'linear-gradient(145deg, #fdf2f8, #ffe4e6)' }
}

const AboutSkills = ({ skills }) => {
  return (
    <section className='heo-about-section heo-about-section--skills heo-card'>
      <div className='heo-card__body'>
        <AboutSectionHeading
          eyebrow='Skills'
          title='技能展示'
          description='聚焦我长期使用的能力栈，从代码到创作，再到内容表达。'
        />

        <div className='heo-about-icon-grid'>
          {skills.map(skill => {
            const Icon = skillIconMap[skill.name]
            const theme = skillThemeMap[skill.name] || {}

            return (
              <div
                key={skill.name}
                className='heo-about-icon-card'
                style={{
                  '--heo-skill-brand': theme.color || 'var(--heo-theme)',
                  '--heo-skill-bg': theme.bg || 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))'
                }}>
                <div className='heo-about-icon-card__icon'>
                  {Icon ? <Icon className='heo-about-icon-card__svg' aria-hidden='true' /> : <span className='heo-about-icon-card__symbol'>{skill.symbol || skill.name.slice(0, 2)}</span>}
                </div>
                <div className='heo-about-icon-card__content'>
                  <div className='heo-about-icon-card__name'>{skill.name}</div>
                  {skill.accent ? <div className='heo-about-icon-card__meta'>{skill.accent}</div> : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutSkills
