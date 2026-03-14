import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const buildParticles = ({
  count,
  prefix,
  leftBase = 4,
  leftStep = 11,
  topBase = 8,
  topStep = 12,
  durationBase,
  durationStep,
  delayStep,
  sizeBase,
  sizeStep,
  driftBase,
  driftStep,
  opacityBase,
  opacityStep
}) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    left: `${leftBase + ((index * leftStep) % 92)}%`,
    top: `${topBase + ((index * topStep) % 74)}%`,
    size: `${sizeBase + (index % 4) * sizeStep}px`,
    duration: `${durationBase + (index % 5) * durationStep}s`,
    delay: `-${index * delayStep}s`,
    drift: `${driftBase + (index % 5) * driftStep}px`,
    opacity: opacityBase + (index % 4) * opacityStep
  }))

const SAKURA_PARTICLES = buildParticles({
  count: 14,
  prefix: 'sakura',
  durationBase: 13.5,
  durationStep: 1.9,
  delayStep: 1.35,
  sizeBase: 16,
  sizeStep: 5,
  driftBase: 22,
  driftStep: 9,
  opacityBase: 0.24,
  opacityStep: 0.06
})

const METEOR_PARTICLES = Array.from({ length: 4 }, (_, index) => ({
  id: `meteor-${index}`,
  top: `${10 + index * 14}%`,
  left: `${52 + index * 9}%`,
  duration: `${7.8 + index * 1.4}s`,
  delay: `-${index * 2.2}s`,
  angle: `${-20 - index * 4}deg`,
  distance: `${190 + index * 34}px`,
  streak: `${72 + index * 20}px`
}))

const SUMMER_PARTICLES = buildParticles({
  count: 12,
  prefix: 'summer',
  leftBase: 10,
  leftStep: 11,
  topBase: 14,
  topStep: 10,
  durationBase: 6,
  durationStep: 0.8,
  delayStep: 0.9,
  sizeBase: 8,
  sizeStep: 2.2,
  driftBase: 14,
  driftStep: 6,
  opacityBase: 0.28,
  opacityStep: 0.07
})

const AUTUMN_PARTICLES = buildParticles({
  count: 11,
  prefix: 'autumn',
  durationBase: 16.5,
  durationStep: 1.9,
  delayStep: 1.6,
  sizeBase: 16,
  sizeStep: 4,
  driftBase: 24,
  driftStep: 8,
  opacityBase: 0.16,
  opacityStep: 0.04
})

const WINTER_PARTICLES = buildParticles({
  count: 14,
  prefix: 'winter',
  leftBase: 3,
  leftStep: 8,
  durationBase: 14,
  durationStep: 1.4,
  delayStep: 1.1,
  sizeBase: 6,
  sizeStep: 1.8,
  driftBase: 10,
  driftStep: 4,
  opacityBase: 0.2,
  opacityStep: 0.04
})

const SAKURA_VARIANTS = [
  'M12 1.8c1.9 2.5 2.5 4.6 2 6.4-.4 1.4-1.4 2.6-2.8 3.4 1.2.3 2.2.9 2.8 1.9 1 1.6 1 3.7.1 6-2.8-.2-4.9-.9-6.2-2.2-.9-.8-1.4-1.8-1.7-3-1 1-2.1 1.5-3.5 1.6-2 .1-4-.8-5.7-2.6 1.1-2.6 2.5-4.2 4.2-4.9 1.2-.5 2.4-.5 3.7-.1-.6-1.1-.8-2.2-.5-3.5.4-1.9 1.8-3.5 4.1-4.8 2.1.7 3.6 1.7 4.5 3.1z',
  'M11.8 1.2c1.4 2 2 3.7 1.8 5.4-.2 1.3-.9 2.5-2 3.5 1.4.3 2.6 1 3.3 2.1 1.1 1.6 1.2 3.7.3 6.2-2.7 0-4.7-.5-6.1-1.5-1-.7-1.8-1.8-2.4-3.1-.8 1.3-1.8 2.2-3 2.8-1.7.8-3.8.8-6.2 0 .2-2.8.9-4.8 2.1-6.2.9-1 2-1.6 3.5-1.8-1-.9-1.7-2-1.8-3.4-.2-1.9.6-4 2.2-6.1 2.6.8 4.4 1.8 5.4 3.1 1.1-1 2.4-1.4 3.9-1z'
]

const AUTUMN_VARIANTS = [
  'M12 1c1.6 2.1 2.3 4.2 2.2 6.2 2-.9 4.1-.9 6.3.1-.2 2.6-1 4.5-2.5 5.8-1 .9-2.1 1.5-3.5 1.7 1.2 1 2 2.2 2.4 3.8.5 2.1 0 4.4-1.4 7-3-.8-5.1-2.1-6.3-4-.8-1.2-1.2-2.6-1.2-4.2-.9 1.2-2 2.1-3.3 2.7-1.9.8-4.2.7-6.8-.2.2-3 .9-5.2 2.2-6.7.9-1.1 2-1.9 3.4-2.4-1.4-.6-2.6-1.5-3.4-2.8-1.1-1.7-1.4-4-.8-6.8 3 .2 5.3 1 6.8 2.5.8.8 1.4 1.8 1.8 2.9.4-1.2 1-2.3 2-3.2C7.7 2.3 9.6 1.4 12 1z',
  'M13.5 1.4c.9 1.8 1.1 3.6.7 5.5 1.8-.3 3.7 0 5.8 1-.5 2.4-1.5 4.1-3.1 5.2-1.1.7-2.3 1.1-3.8 1.1 1 .8 1.8 1.8 2.2 3.1.7 1.9.5 4.3-.5 7-2.9-.4-5.1-1.3-6.7-2.9-.9-.9-1.6-2-2-3.4-.8 1-1.9 1.7-3.2 2.2-1.8.6-4 .5-6.6-.3.6-2.8 1.6-4.8 3.1-6 .8-.7 1.8-1.2 2.9-1.6-1.3-.5-2.4-1.2-3.2-2.3-1.2-1.5-1.8-3.7-1.7-6.5 2.9 0 5.1.6 6.6 1.8 1 .7 1.8 1.7 2.4 2.9.2-1.3.7-2.5 1.5-3.5 1.1-1.5 3-2.6 5.6-3.3z'
]

const SAKURA_ROTATIONS = ['-18deg', '12deg', '28deg', '-32deg']
const AUTUMN_ROTATIONS = ['-12deg', '18deg', '36deg', '-28deg']

const resolveSeasonFromMonth = month => {
  if ([3, 4, 5].includes(month)) return 'spring'
  if ([6, 7, 8].includes(month)) return 'summer'
  if ([9, 10, 11].includes(month)) return 'autumn'
  return 'winter'
}


const AmbienceEffects = () => {
  const { isDarkMode } = useGlobal()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const sakuraEnabled = siteConfig('HEO_AMBIENCE_SAKURA', true, CONFIG)
  const meteorEnabled = siteConfig('HEO_AMBIENCE_METEOR', true, CONFIG)
  const seasonEffectsEnabled = siteConfig('HEO_AMBIENCE_SEASON_EFFECTS', true, CONFIG)
  const seasonMode = siteConfig('HEO_AMBIENCE_SEASON_MODE', 'auto', CONFIG)
  const springEnabled = siteConfig('HEO_AMBIENCE_SEASON_SPRING', true, CONFIG)
  const summerEnabled = siteConfig('HEO_AMBIENCE_SEASON_SUMMER', true, CONFIG)
  const autumnEnabled = siteConfig('HEO_AMBIENCE_SEASON_AUTUMN', true, CONFIG)
  const winterEnabled = siteConfig('HEO_AMBIENCE_SEASON_WINTER', true, CONFIG)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 768px)')

    const syncState = () => {
      setReduceMotion(motionQuery.matches)
      setIsMobile(mobileQuery.matches)
    }

    syncState()

    const handleMotionChange = event => setReduceMotion(event.matches)
    const handleMobileChange = event => setIsMobile(event.matches)

    motionQuery.addEventListener?.('change', handleMotionChange)
    mobileQuery.addEventListener?.('change', handleMobileChange)

    return () => {
      motionQuery.removeEventListener?.('change', handleMotionChange)
      mobileQuery.removeEventListener?.('change', handleMobileChange)
    }
  }, [])

  const activeSeason = useMemo(() => {
    if (!seasonEffectsEnabled || seasonMode === 'off') return null
    if (['spring', 'summer', 'autumn', 'winter'].includes(seasonMode)) return seasonMode
    return resolveSeasonFromMonth(new Date().getMonth() + 1)
  }, [seasonEffectsEnabled, seasonMode])

  const isSeasonEnabled = useMemo(() => ({
    spring: springEnabled,
    summer: summerEnabled,
    autumn: autumnEnabled,
    winter: winterEnabled
  }), [springEnabled, summerEnabled, autumnEnabled, winterEnabled])

  const sakuraParticles = useMemo(() => (isMobile ? SAKURA_PARTICLES.slice(0, 6) : SAKURA_PARTICLES), [isMobile])
  const meteorParticles = useMemo(() => (isMobile ? METEOR_PARTICLES.slice(0, 2) : METEOR_PARTICLES), [isMobile])
  const summerParticles = useMemo(() => (isMobile ? SUMMER_PARTICLES.slice(0, 5) : SUMMER_PARTICLES), [isMobile])
  const autumnParticles = useMemo(() => (isMobile ? AUTUMN_PARTICLES.slice(0, 7) : AUTUMN_PARTICLES), [isMobile])
  const winterParticles = useMemo(() => (isMobile ? WINTER_PARTICLES.slice(0, 9) : WINTER_PARTICLES), [isMobile])

  if (reduceMotion) return null

  const showSpring = Boolean(activeSeason === 'spring' && isSeasonEnabled.spring)
  const showSummer = Boolean(activeSeason === 'summer' && isSeasonEnabled.summer)
  const showAutumn = Boolean(activeSeason === 'autumn' && isSeasonEnabled.autumn)
  const showWinter = Boolean(activeSeason === 'winter' && isSeasonEnabled.winter)
  const useLegacyFallback = !seasonEffectsEnabled || seasonMode === 'off'
  const showLegacySakura = Boolean(useLegacyFallback && !isDarkMode && sakuraEnabled)
  const showMeteor = Boolean(
    (showSummer && isDarkMode) ||
    (useLegacyFallback && isDarkMode && meteorEnabled)
  )


  if (!showSpring && !showSummer && !showAutumn && !showWinter && !showLegacySakura && !showMeteor) {
    return null
  }

  return (
    <div className='heo-ambience-layer' aria-hidden='true' data-season={activeSeason || 'legacy'}>
      {(showSpring || showLegacySakura) && (
        <div className='heo-ambience-track heo-ambience-track--spring'>
          {sakuraParticles.map((particle, index) => (
            <span
              key={particle.id}
              className='heo-sakura-petal'
              style={{
                left: particle.left,
                width: particle.size,
                height: particle.size,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                '--heo-petal-drift': particle.drift,
                '--heo-petal-opacity': particle.opacity,
                '--heo-petal-rotate': SAKURA_ROTATIONS[index % SAKURA_ROTATIONS.length]
              }}>
              <svg viewBox='0 0 24 24' className='heo-season-shape' aria-hidden='true'>
                <path d={SAKURA_VARIANTS[index % SAKURA_VARIANTS.length]} />
              </svg>
            </span>
          ))}
        </div>
      )}

      {showSummer && (
        <div className='heo-ambience-track heo-ambience-track--summer'>
          {summerParticles.map((particle, index) => (
            <span
              key={particle.id}
              className='heo-summer-glow'
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                '--heo-summer-drift': particle.drift,
                '--heo-summer-opacity': particle.opacity,
                '--heo-summer-scale': `${1 + (index % 3) * 0.22}`
              }}
            />
          ))}
        </div>
      )}

      {showAutumn && (
        <div className='heo-ambience-track heo-ambience-track--autumn'>
          {autumnParticles.map((particle, index) => (
            <span
              key={particle.id}
              className='heo-autumn-leaf'
              style={{
                left: particle.left,
                width: particle.size,
                height: particle.size,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                '--heo-leaf-drift': particle.drift,
                '--heo-leaf-opacity': particle.opacity,
                '--heo-leaf-rotate': AUTUMN_ROTATIONS[index % AUTUMN_ROTATIONS.length]
              }}>
              <svg viewBox='0 0 24 24' className='heo-season-shape' aria-hidden='true'>
                <path d={AUTUMN_VARIANTS[index % AUTUMN_VARIANTS.length]} />
              </svg>
            </span>
          ))}
        </div>
      )}


      {showWinter && (
        <div className='heo-ambience-track heo-ambience-track--winter'>
          {winterParticles.map(particle => (
            <span
              key={particle.id}
              className='heo-winter-snow'
              style={{
                left: particle.left,
                width: particle.size,
                height: particle.size,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                '--heo-snow-drift': particle.drift,
                '--heo-snow-opacity': particle.opacity
              }}
            />
          ))}
        </div>
      )}

      {showMeteor && (
        <div className='heo-ambience-track heo-ambience-track--meteor'>
          {meteorParticles.map(particle => (
            <span
              key={particle.id}
              className='heo-meteor'
              style={{
                top: particle.top,
                left: particle.left,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                '--heo-meteor-angle': particle.angle,
                '--heo-meteor-distance': particle.distance,
                '--heo-meteor-streak': particle.streak
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .heo-ambience-layer {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 2;
          overflow: hidden;
        }

        .heo-ambience-track {
          position: absolute;
          inset: 0;
        }

        .heo-ambience-track--spring,
        .heo-ambience-track--autumn,
        .heo-ambience-track--winter {
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.98), rgba(0, 0, 0, 0.82) 70%, transparent 100%);
        }

        .heo-season-shape {
          width: 100%;
          height: 100%;
          display: block;
          transform: rotate(var(--heo-petal-rotate, var(--heo-leaf-rotate, 0deg)));
        }

        .heo-season-shape path {
          fill: currentColor;
        }

        .heo-sakura-petal {
          --heo-petal-drift: 26px;
          --heo-petal-opacity: 0.22;
          position: absolute;
          top: -8%;
          color: rgba(255, 196, 221, 0.96);
          opacity: var(--heo-petal-opacity);
          transform: translate3d(0, 0, 0) rotate(0deg);
          animation: heoSakuraFall linear infinite;
          filter: drop-shadow(0 8px 16px rgba(190, 24, 93, 0.22));
        }

        .heo-sakura-petal .heo-season-shape {
          filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.36));
        }

        .heo-sakura-petal::before {
          content: '';
          position: absolute;
          inset: 18% 22% 36% 22%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0));
          transform: rotate(-16deg);
        }

        .heo-summer-glow {
          --heo-summer-drift: 18px;
          --heo-summer-opacity: 0.22;
          --heo-summer-scale: 1;
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 250, 176, 1) 0%, rgba(250, 204, 21, 0.88) 18%, rgba(251, 191, 36, 0.42) 42%, rgba(255, 255, 255, 0) 76%);
          box-shadow: 0 0 22px rgba(250, 204, 21, 0.34), 0 0 42px rgba(34, 211, 238, 0.18);
          opacity: var(--heo-summer-opacity);
          animation: heoSummerFloat ease-in-out infinite;
          transform: scale(var(--heo-summer-scale));
        }

        :global(html.dark) .heo-summer-glow {
          background: radial-gradient(circle, rgba(255, 251, 180, 0.98) 0%, rgba(125, 211, 252, 0.48) 28%, rgba(34, 211, 238, 0.22) 52%, rgba(255, 255, 255, 0) 76%);
          box-shadow: 0 0 26px rgba(250, 204, 21, 0.32), 0 0 46px rgba(96, 165, 250, 0.2);
        }

        .heo-summer-glow::before {
          content: '';
          position: absolute;
          inset: 32%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 250, 220, 1), rgba(255, 255, 255, 0));
          filter: blur(1px);
        }

        .heo-summer-glow::after {
          content: '';
          position: absolute;
          inset: -28px;
          border-radius: inherit;
          background: radial-gradient(circle, rgba(253, 224, 71, 0.16), rgba(45, 212, 191, 0.08) 38%, transparent 70%);
          filter: blur(10px);
        }

        .heo-autumn-leaf {
          --heo-leaf-drift: 30px;
          --heo-leaf-opacity: 0.2;
          position: absolute;
          top: -10%;
          color: rgba(249, 115, 22, 0.94);
          opacity: var(--heo-leaf-opacity);
          animation: heoAutumnFall linear infinite;
          transform-origin: center center;
          filter: drop-shadow(0 10px 20px rgba(194, 65, 12, 0.2));
        }

        .heo-autumn-leaf:nth-child(odd) {
          color: rgba(245, 158, 11, 0.94);
        }

        .heo-autumn-leaf .heo-season-shape {
          filter: drop-shadow(0 0 1px rgba(255, 247, 237, 0.24));
        }

        .heo-autumn-leaf::before {
          content: '';
          position: absolute;
          left: 48%;
          top: 18%;
          bottom: 16%;
          width: 1px;
          background: rgba(120, 53, 15, 0.26);
          transform: rotate(10deg);
        }


        .heo-winter-snow {
          --heo-snow-drift: 14px;
          --heo-snow-opacity: 0.3;
          position: absolute;
          top: -8%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.96), rgba(219, 234, 254, 0.88) 58%, rgba(255, 255, 255, 0) 74%);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.18);
          opacity: var(--heo-snow-opacity);
          animation: heoWinterSnow linear infinite;
        }

        .heo-meteor {
          --heo-meteor-angle: -24deg;
          --heo-meteor-distance: 220px;
          --heo-meteor-streak: 88px;
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255, 244, 214, 0.96);
          box-shadow: 0 0 18px rgba(253, 224, 71, 0.55), 0 0 34px rgba(96, 165, 250, 0.28);
          transform: rotate(var(--heo-meteor-angle));
          animation: heoMeteorSweep ease-in-out infinite;
          opacity: 0;
        }

        .heo-meteor::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          width: var(--heo-meteor-streak);
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(90deg, rgba(255, 248, 220, 0.96), rgba(125, 211, 252, 0.28), transparent 88%);
          transform-origin: right center;
        }

        @keyframes heoSakuraFall {
          0% { transform: translate3d(0, -8vh, 0) rotate(0deg); }
          35% { transform: translate3d(calc(var(--heo-petal-drift) * -1), 36vh, 0) rotate(132deg); }
          65% { transform: translate3d(var(--heo-petal-drift), 68vh, 0) rotate(228deg); }
          100% { transform: translate3d(calc(var(--heo-petal-drift) * -0.5), 110vh, 0) rotate(320deg); }
        }

        @keyframes heoSummerFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.92);
            opacity: calc(var(--heo-summer-opacity) * 0.88);
          }
          50% {
            transform: translate3d(var(--heo-summer-drift), -18px, 0) scale(1.08);
            opacity: calc(var(--heo-summer-opacity) + 0.12);
          }
        }

        @keyframes heoAutumnFall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); }
          30% { transform: translate3d(var(--heo-leaf-drift), 30vh, 0) rotate(72deg); }
          60% { transform: translate3d(calc(var(--heo-leaf-drift) * -0.9), 66vh, 0) rotate(164deg); }
          100% { transform: translate3d(calc(var(--heo-leaf-drift) * 0.4), 108vh, 0) rotate(248deg); }
        }

        @keyframes heoWinterSnow {
          0% { transform: translate3d(0, -6vh, 0) scale(0.86); }
          35% { transform: translate3d(var(--heo-snow-drift), 32vh, 0) scale(1); }
          70% { transform: translate3d(calc(var(--heo-snow-drift) * -0.75), 72vh, 0) scale(0.94); }
          100% { transform: translate3d(calc(var(--heo-snow-drift) * 0.4), 108vh, 0) scale(0.82); }
        }

        @keyframes heoMeteorSweep {
          0%, 72%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(var(--heo-meteor-angle));
          }
          76% { opacity: 0.9; }
          92% {
            opacity: 0;
            transform: translate3d(calc(var(--heo-meteor-distance) * -1), var(--heo-meteor-distance), 0) rotate(var(--heo-meteor-angle));
          }
        }

        @media (max-width: 768px) {
          .heo-sakura-petal,
          .heo-autumn-leaf,
          .heo-winter-snow {
            opacity: calc(var(--heo-petal-opacity, var(--heo-leaf-opacity, var(--heo-snow-opacity, 0.22))) * 0.8);
          }

          .heo-meteor::after {
            width: calc(var(--heo-meteor-streak) * 0.72);
          }
        }
      `}</style>
    </div>
  )
}

export default AmbienceEffects
