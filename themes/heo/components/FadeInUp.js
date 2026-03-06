import { useEffect, useRef, useState } from 'react'

/**
 * 淡入上升动画组件
 * 使用 Intersection Observer API 实现，性能优于 wow.js
 * @param {*} props
 * @param {string} props.className - 额外的 CSS 类名
 * @param {number} props.delay - 动画延迟时间（毫秒）
 * @param {number} props.threshold - 触发阈值（0-1）
 * @param {React.ReactNode} props.children - 子组件
 * @returns
 */
const FadeInUp = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 使用 setTimeout 实现延迟效果
          const timer = setTimeout(() => {
            setIsVisible(true)
          }, delay)

          observer.unobserve(entry.target)

          return () => clearTimeout(timer)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, threshold])

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default FadeInUp