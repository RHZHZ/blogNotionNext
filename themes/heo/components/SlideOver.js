import { Eye, EyeSlash } from '@/components/HeroIcons'
import DarkModeButton from '@/components/DarkModeButton'
import { useGlobal } from '@/lib/global'
import { Dialog, Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { MenuListSide } from './MenuListSide'
import TagGroups from './TagGroups'

const drawerActionClassName =
  'group flex items-center justify-between rounded-[1.35rem] border border-slate-200/65 bg-white/94 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-[0_6px_16px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:border-slate-700/35 dark:bg-slate-900/68 dark:text-slate-100 dark:hover:bg-white/[0.08] dark:focus-visible:ring-amber-400/30'

const drawerSectionTrayClassName =
  'heo-card rounded-[1.45rem] border-slate-200/70 bg-slate-50/58 p-2 dark:border-slate-700/34 dark:bg-slate-900/22'

/**
 * 侧边抽屉
 * 移动端的菜单在这里
 */
export default function SlideOver(props) {
  const { cRef, tagOptions } = props
  const [open, setOpen] = useState(false)
  const [coverColor, setCoverColor] = useState(null)
  const { locale, isDarkMode, isEyeCareMode, toggleEyeCareMode } = useGlobal()
  const router = useRouter()

  useImperativeHandle(cRef, () => ({
    toggleSlideOvers: toggleSlideOvers
  }))

  const toggleSlideOvers = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const fallbackColor = isDarkMode ? '#F59E0B' : '#2563EB'

    const applyGlobalColor = colorFromEvent => {
      if (typeof window === 'undefined') {
        setCoverColor(fallbackColor)
        return
      }

      const rootColor =
        colorFromEvent ||
        window.getComputedStyle(document.documentElement)
          .getPropertyValue('--heo-cover-color')
          .trim()

      setCoverColor(rootColor || fallbackColor)
    }

    applyGlobalColor()

    const onColorChange = event => {
      applyGlobalColor(event?.detail?.color)
    }

    window.addEventListener('heo-cover-color-change', onColorChange)
    return () => {
      window.removeEventListener('heo-cover-color-change', onColorChange)
    }
  }, [isDarkMode])

  useEffect(() => {
    setOpen(false)
  }, [router])

  const accentColor = coverColor || (isDarkMode ? '#F59E0B' : '#2563EB')
  const panelStyle = {
    '--drawer-accent': accentColor,
    borderLeftColor: isDarkMode
      ? 'color-mix(in srgb, var(--drawer-accent) 8%, rgba(255,255,255,0.06))'
      : 'color-mix(in srgb, var(--drawer-accent) 8%, rgba(203,213,225,0.7))',
    boxShadow: isDarkMode
      ? '0 24px 72px rgba(0,0,0,0.38), inset 1px 0 0 rgba(255,255,255,0.03)'
      : '0 24px 80px rgba(15,23,42,0.14), inset 1px 0 0 rgba(255,255,255,0.78)'
  }
  const sectionStyle = {
    borderColor: isDarkMode
      ? 'rgba(71,85,105,0.28)'
      : 'rgba(203,213,225,0.72)',
    background: isDarkMode ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.88)',
    boxShadow: isDarkMode ? 'none' : '0 10px 28px rgba(15,23,42,0.05)'
  }
  const sectionTitleStyle = {
    color: isDarkMode
      ? '#94A3B8'
      : 'color-mix(in srgb, var(--drawer-accent) 18%, #94A3B8)'
  }
  const heroStyle = {
    borderColor: isDarkMode
      ? 'rgba(71,85,105,0.56)'
      : 'rgba(203,213,225,0.68)',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30,41,59,0.94), rgba(30,41,59,0.82))'
      : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))'
  }
  const actionSectionStyle = {
    ...sectionStyle,
    boxShadow: 'none'
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-30' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-slate-950/42 backdrop-blur-md transition-opacity dark:bg-black/60' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-[cubic-bezier(0.22,1,0.36,1)] duration-500 sm:duration-700'
                enterFrom='translate-x-full opacity-0 scale-[0.985]'
                enterTo='translate-x-0 opacity-100 scale-100'
                leave='transform transition ease-in-out duration-400 sm:duration-500'
                leaveFrom='translate-x-0 opacity-100 scale-100'
                leaveTo='translate-x-full opacity-0 scale-[0.99]'>
                <Dialog.Panel className='pointer-events-auto relative w-[92vw] max-w-md origin-right will-change-transform'>
                  <div
                    style={panelStyle}
                    className='flex h-full flex-col overflow-hidden rounded-l-[2rem] border-l bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-[#eef2f7] py-4 backdrop-blur-2xl dark:from-[#0f172a] dark:via-[#111827] dark:to-[#0b1120]'>
                    <div className='px-5 pb-4 pt-2'>
                      <div
                        style={heroStyle}
                        className='heo-card rounded-[1.75rem] px-4 py-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <div
                              style={sectionTitleStyle}
                              className='text-[11px] font-semibold uppercase tracking-[0.28em]'>
                              HEO MENU
                            </div>
                            <div className='mt-2 truncate text-lg font-bold text-slate-800 dark:text-white'>
                              {locale.COMMON.BLOG}
                            </div>
                          </div>
                          <button
                            type='button'
                            className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/92 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:border-slate-700/40 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-slate-100 dark:focus-visible:ring-amber-400/30'
                            onClick={() => setOpen(false)}>
                            <span className='sr-only'>Close panel</span>
                            <i className='fa-solid fa-xmark text-base'></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='mx-5 mb-4 grid grid-cols-2 gap-3'>
                      <DarkModeBlockButton accentColor={accentColor} isDarkMode={isDarkMode} />
                      <EyeCareBlockButton
                        accentColor={accentColor}
                        isDarkMode={isDarkMode}
                        isEyeCareMode={isEyeCareMode}
                        toggleEyeCareMode={toggleEyeCareMode}
                      />
                    </div>

                    <div className='flex-1 overflow-y-auto px-5 pb-6 dark:text-white'>
                      <section className='space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          Quick Access
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                          <Button title={'主页'} url={'/'} icon='fas fa-house' accentColor={accentColor} isDarkMode={isDarkMode} />
                          <Button title={'关于'} url={'/about'} icon='fas fa-circle-info' accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>

                      <section className='mt-5 space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          Navigation
                        </div>
                        <div
                          style={actionSectionStyle}
                          className={drawerSectionTrayClassName}>
                          <MenuListSide {...props} accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>

                      <section className='mt-5 space-y-3'>
                        <div
                          style={sectionTitleStyle}
                          className='px-1 text-[11px] font-semibold uppercase tracking-[0.24em]'>
                          {locale.COMMON.TAGS}
                        </div>
                        <div
                          style={actionSectionStyle}
                          className={`${drawerSectionTrayClassName} px-2.5 py-2.5`}>
                          <TagGroups tags={tagOptions} accentColor={accentColor} isDarkMode={isDarkMode} />
                        </div>
                      </section>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function DarkModeBlockButton({ accentColor, isDarkMode }) {
  const darkModeRef = useRef()
  const { isDarkMode: currentDarkMode, locale } = useGlobal()

  function handleChangeDarkMode() {
    darkModeRef?.current?.handleChangeDarkMode()
  }

  const iconStyle = {
    background: currentDarkMode
      ? isDarkMode
        ? `color-mix(in srgb, ${accentColor} 26%, rgba(255,255,255,0.12))`
        : `color-mix(in srgb, ${accentColor} 18%, #EFF6FF)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
        : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: currentDarkMode
      ? isDarkMode
        ? '#FCD34D'
        : `color-mix(in srgb, ${accentColor} 60%, #1D4ED8)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
        : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  return (
    <button
      onClick={handleChangeDarkMode}
      className={`${drawerActionClassName} ${currentDarkMode ? 'border-blue-200/80 bg-blue-50/95 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.14)] dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 dark:shadow-[0_12px_28px_rgba(245,158,11,0.14)]' : ''}`}>
      <span className='flex items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-9 w-9 items-center justify-center rounded-[1.1rem] transition-colors duration-300'>
          <DarkModeButton cRef={darkModeRef} className='group-hover:text-current' />
        </span>
        <span>{currentDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}</span>
      </span>
      <i className={`fas fa-angle-right text-xs transition-transform duration-300 group-hover:translate-x-0.5 ${currentDarkMode ? 'text-blue-500 dark:text-amber-300' : 'text-slate-400'}`}></i>
    </button>
  )
}



function EyeCareBlockButton({ accentColor, isDarkMode, isEyeCareMode, toggleEyeCareMode }) {
  const iconStyle = {
    background: isEyeCareMode
      ? isDarkMode
        ? `color-mix(in srgb, ${accentColor} 26%, rgba(255,255,255,0.12))`
        : `color-mix(in srgb, ${accentColor} 18%, #EFF6FF)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
        : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: isEyeCareMode
      ? isDarkMode
        ? '#FCD34D'
        : `color-mix(in srgb, ${accentColor} 60%, #1D4ED8)`
      : isDarkMode
        ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
        : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  return (
    <button
      type='button'
      onClick={toggleEyeCareMode}
      className={`${drawerActionClassName} ${isEyeCareMode ? 'border-blue-200/80 bg-blue-50/95 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.14)] dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 dark:shadow-[0_12px_28px_rgba(245,158,11,0.14)]' : ''}`}>
      <span className='flex items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-9 w-9 items-center justify-center rounded-[1.1rem] transition-colors duration-300'>
          {isEyeCareMode ? <EyeSlash /> : <Eye />}
        </span>
        <span>{isEyeCareMode ? '关闭护眼' : '开启护眼'}</span>
      </span>
      <i className={`fas fa-angle-right text-xs transition-transform duration-300 group-hover:translate-x-0.5 ${isEyeCareMode ? 'text-blue-500 dark:text-amber-300' : 'text-slate-400'}`}></i>
    </button>
  )
}


function Button({ title, url, icon, accentColor, isDarkMode }) {
  const iconStyle = {
    background: isDarkMode
      ? `color-mix(in srgb, ${accentColor} 10%, rgba(255,255,255,0.08))`
      : `color-mix(in srgb, ${accentColor} 8%, #F8FAFC)`,
    color: isDarkMode
      ? `color-mix(in srgb, ${accentColor} 35%, #E2E8F0)`
      : `color-mix(in srgb, ${accentColor} 30%, #475569)`
  }

  return (
    <SmartLink
      href={url}
      className={drawerActionClassName}>
      <span className='flex min-w-0 items-center gap-3'>
        <span
          style={iconStyle}
          className='flex h-8.5 w-8.5 flex-shrink-0 items-center justify-center rounded-[1rem] transition-colors duration-300'>
          <i className={icon}></i>
        </span>
        <span className='truncate'>{title}</span>
      </span>
      <i className='fas fa-angle-right text-xs text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5'></i>
    </SmartLink>
  )
}
