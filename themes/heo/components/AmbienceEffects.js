import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const SAKURA_PARTICLES = Array.from({ length: 10 }, (_, index) => ({
  id: `sakura-${index}`,
  left: `${6 + ((index * 9) % 88)}%`,
  size: `${14 + (index % 4) * 4}px`,
  duration: `${15 + (index % 5) * 2.4}s`,
  delay: `-${(index % 6) * 2.1}s`,
  drift: `${18 + (index % 5) * 7}px`,
  opacity: 0.16 + (index % 4) * 0.04
}))

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

const AmbienceEffects = () => {
  const { isDarkMode } = useGlobal()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const sakuraEnabled = siteConfig('HEO_AMBIENCE_SAKURA', true, CONFIG)
  const meteorEnabled = siteConfig('HEO_AMBIENCE_METEOR', true, CONFIG)

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

  const sakuraParticles = useMemo(() => {
    return isMobile ? SAKURA_PARTICLES.slice(0, 6) : SAKURA_PARTICLES
  }, [isMobile])

  const meteorParticles = useMemo(() => {
    return isMobile ? METEOR_PARTICLES.slice(0, 2) : METEOR_PARTICLES
  }, [isMobile])

  if (reduceMotion) return null

  const showSakura = !isDarkMode && sakuraEnabled
  const showMeteor = isDarkMode && meteorEnabled

  if (!showSakura && !showMeteor) return null

  return (
    <div className='heo-ambience-layer' aria-hidden='true'>
      {showSakura && (
        <div className='heo-ambience-track heo-ambience-track--sakura'>
          {sakuraParticles.map(particle => (
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
                '--heo-petal-opacity': particle.opacity
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
          z-index: 0;
          overflow: hidden;
        }


        .heo-ambience-track {
          position: absolute;
          inset: 0;
        }

        .heo-sakura-petal {
          --heo-petal-drift: 26px;
          --heo-petal-opacity: 0.22;
          position: absolute;
          top: -8%;
          border-radius: 70% 30% 65% 35%;
          background: linear-gradient(145deg, rgba(255, 244, 249, 0.88), rgba(244, 163, 189, 0.72));
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.24) inset, 0 10px 24px rgba(244, 163, 189, 0.1);
          opacity: var(--heo-petal-opacity);
          transform: translate3d(0, 0, 0) rotate(0deg);
          animation-name: heoSakuraFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: blur(0.2px);
        }

        .heo-sakura-petal::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 60% 40% 72% 28%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.56), transparent 68%);
          transform: rotate(-24deg);
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
          animation-name: heoMeteorSweep;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
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
          0% {
            transform: translate3d(0, -8vh, 0) rotate(0deg);
          }
          35% {
            transform: translate3d(calc(var(--heo-petal-drift) * -1), 36vh, 0) rotate(132deg);
          }
          65% {
            transform: translate3d(var(--heo-petal-drift), 68vh, 0) rotate(228deg);
          }
          100% {
            transform: translate3d(calc(var(--heo-petal-drift) * -0.5), 110vh, 0) rotate(320deg);
          }
        }

        @keyframes heoMeteorSweep {
          0%, 72%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(var(--heo-meteor-angle));
          }
          76% {
            opacity: 0.9;
          }
          92% {
            opacity: 0;
            transform: translate3d(calc(var(--heo-meteor-distance) * -1), var(--heo-meteor-distance), 0) rotate(var(--heo-meteor-angle));
          }
        }

        @media (max-width: 768px) {
          .heo-sakura-petal {
            opacity: calc(var(--heo-petal-opacity) * 0.8);
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
