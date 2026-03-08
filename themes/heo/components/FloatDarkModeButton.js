import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

export default function FloatDarkModeButton () {
  const { isDarkMode, updateDarkMode } = useGlobal()

  if (!siteConfig('HEO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
    <button
      type='button'
      aria-label='切换深色模式'
      title='切换深色模式'
      onClick={handleChangeDarkMode}
      className='heo-float-widget-btn heo-float-widget-btn--icon-only'
    >
      <i
        id='darkModeButton'
        className={`heo-float-widget-btn__icon ${isDarkMode ? 'fa-sun' : 'fa-moon'} fas`}
      />
    </button>
  )
}
