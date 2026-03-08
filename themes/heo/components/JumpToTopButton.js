import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = ({ showPercent = true, percent }) => {
  const { locale } = useGlobal()

  if (!siteConfig('HEO_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>
  }
  return (
    <button
      type='button'
      title={locale.POST.TOP}
      aria-label={locale.POST.TOP}
      className='heo-float-widget-btn heo-float-widget-btn--stack'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <span className='heo-float-widget-btn__icon-wrap'>
        <i className='heo-float-widget-btn__icon fas fa-arrow-up' />
      </span>
      {showPercent && <span className='heo-float-widget-btn__meta hidden lg:block'>{percent}</span>}
    </button>
  )
}

export default JumpToTopButton
