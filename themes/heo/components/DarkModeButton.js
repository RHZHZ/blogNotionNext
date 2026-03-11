import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import { Moon, Sun } from '@/components/HeroIcons'
import { useImperativeHandle } from 'react'

const emitModeToast = message => {
  if (typeof window === 'undefined' || !message) return
  window.dispatchEvent(new CustomEvent('heo-mode-toast', { detail: { message } }))
}

/**
 * 深色模式按钮
 */
const DarkModeButton = (props) => {
  const { cRef, className } = props
  const { isDarkMode, updateDarkMode } = useGlobal()

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode()
      }
    }
  })

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
    emitModeToast(newStatus ? '晚一点的光已经替你放轻了，安心看吧' : '天光又亮起来一点了，继续慢慢看吧')
  }

  return (
    <button
      type='button'
      onClick={handleChangeDarkMode}
      aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      className={`heo-header-action-btn ${className || ''}`}>
      <span id='darkModeButton' className='flex items-center justify-center'>
        {isDarkMode ? <Sun /> : <Moon />}
      </span>
    </button>
  )
}
export default DarkModeButton
