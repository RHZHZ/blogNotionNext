import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import { Moon, Sun } from '@/components/HeroIcons'
import { useImperativeHandle } from 'react'

const DarkModeButton = props => {
  const { cRef, className } = props
  const { isDarkMode, updateDarkMode } = useGlobal()

  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode()
      }
    }
  })

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
