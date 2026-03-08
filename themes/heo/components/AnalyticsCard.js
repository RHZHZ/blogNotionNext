import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 博客统计卡牌
 * @param {*} props
 * @returns
 */
export function AnalyticsCard(props) {
  const { isDarkMode } = useGlobal()
  const targetDate = new Date(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const today = new Date()
  const diffTime = today.getTime() - targetDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const postCountTitle = siteConfig('HEO_POST_COUNT_TITLE', null, CONFIG)
  const siteTimeTitle = siteConfig('HEO_SITE_TIME_TITLE', null, CONFIG)
  const siteVisitTitle = siteConfig('HEO_SITE_VISIT_TITLE', null, CONFIG)
  const siteVisitorTitle = siteConfig('HEO_SITE_VISITOR_TITLE', null, CONFIG)

  const { postCount } = props

  const itemStyle = {
    borderColor: isDarkMode ? 'rgba(71,85,105,0.28)' : 'rgba(226,232,240,0.9)',
    background: isDarkMode ? 'rgba(15,23,42,0.34)' : 'rgba(255,255,255,0.78)'
  }

  const hoverStyle = {
    borderColor: isDarkMode ? 'rgba(245,158,11,0.22)' : 'rgba(191,219,254,0.86)',
    background: isDarkMode ? 'rgba(154,52,18,0.2)' : 'rgba(248,250,252,0.96)',
    boxShadow: isDarkMode ? '0 10px 24px rgba(120,53,15,0.18)' : '0 10px 24px rgba(59,130,246,0.07)'
  }

  const labelStyle = {
    color: isDarkMode ? '#94A3B8' : '#64748B'
  }

  const valueStyle = {
    color: isDarkMode ? '#F8FAFC' : '#0F172A'
  }

  const hoverValueStyle = {
    color: isDarkMode ? '#FCD34D' : '#334155'
  }

  return (
    <div className='grid gap-2 px-1'>
      <StatItem label={postCountTitle} value={postCount} itemStyle={itemStyle} hoverStyle={hoverStyle} labelStyle={labelStyle} valueStyle={valueStyle} hoverValueStyle={hoverValueStyle} />
      <StatItem label={siteTimeTitle} value={`${diffDays} 天`} itemStyle={itemStyle} hoverStyle={hoverStyle} labelStyle={labelStyle} valueStyle={valueStyle} hoverValueStyle={hoverValueStyle} />
      <div className='hidden busuanzi_container_page_pv'>
        <StatItem label={siteVisitTitle} value={<span className='busuanzi_value_page_pv' />} itemStyle={itemStyle} hoverStyle={hoverStyle} labelStyle={labelStyle} valueStyle={valueStyle} hoverValueStyle={hoverValueStyle} />
      </div>
      <div className='hidden busuanzi_container_site_uv'>
        <StatItem label={siteVisitorTitle} value={<span className='busuanzi_value_site_uv' />} itemStyle={itemStyle} hoverStyle={hoverStyle} labelStyle={labelStyle} valueStyle={valueStyle} hoverValueStyle={hoverValueStyle} />
      </div>
    </div>
  )
}

function StatItem({ label, value, itemStyle, hoverStyle, labelStyle, valueStyle, hoverValueStyle }) {
  return (
    <div
      style={itemStyle}
      onMouseEnter={e => {
        Object.assign(e.currentTarget.style, { ...itemStyle, ...hoverStyle })
        const valueNode = e.currentTarget.querySelector('[data-stat-value]')
        if (valueNode) Object.assign(valueNode.style, hoverValueStyle)
      }}
      onMouseLeave={e => {
        Object.assign(e.currentTarget.style, itemStyle)
        const valueNode = e.currentTarget.querySelector('[data-stat-value]')
        if (valueNode) Object.assign(valueNode.style, valueStyle)
      }}
      className='flex items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-200'>
      <div style={labelStyle} className='text-sm font-medium'>
        {label}
      </div>
      <div data-stat-value style={valueStyle} className='text-sm font-semibold'>
        {value}
      </div>
    </div>
  )
}
