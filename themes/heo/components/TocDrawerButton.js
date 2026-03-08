import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  const { locale } = useGlobal()
  if (!siteConfig('HEO_WIDGET_TOC', null, CONFIG)) {
    return <></>
  }

  return (
    <button
      type='button'
      onClick={props.onClick}
      className='heo-float-widget-btn heo-float-widget-btn--icon-only'
      title={locale.POST.TOP}>
      <i className='fas fa-list-ol heo-float-widget-btn__icon' />
    </button>
  )
}

export default TocDrawerButton
