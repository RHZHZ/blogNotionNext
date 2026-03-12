import { Dialog, Portal, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import Catalog from './Catalog'

/**
 * 移动端悬浮目录按钮
 */
export default function FloatTocButton(props) {
  const [tocVisible, changeTocVisible] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { post } = props
  const router = useRouter()

  const toggleToc = () => {
    changeTocVisible(prev => !prev)
  }

  useEffect(() => {
    const closeToc = () => changeTocVisible(false)
    router.events.on('routeChangeComplete', closeToc)
    return () => {
      router.events.off('routeChangeComplete', closeToc)
    }
  }, [router.events])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timer = null

    const syncScrollState = () => {
      const nextHasScrolled = window.scrollY > 120
      setHasScrolled(nextHasScrolled)
      setIsScrolling(true)

      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setIsScrolling(false)
      }, 180)
    }

    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncScrollState)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  if (!post || !post.toc || post.toc.length < 1) {
    return <></>
  }

  return (
    <>
      <Portal>
        <div
          className={`heo-float-toc-anchor heo-float-toc-anchor--portal fixed right-4 z-[121] lg:hidden ${hasScrolled ? 'is-active' : ''} ${isScrolling ? 'is-scrolling' : ''}`}>
          <button
            type='button'
            onClick={toggleToc}
            aria-label='打开文章目录'
            title='打开文章目录'
            className='heo-float-widget-btn heo-float-widget-btn--portal heo-float-widget-btn--icon-only'>

            <i className='fas fa-list-ol heo-float-widget-btn__icon' />
          </button>
        </div>
      </Portal>

      <Transition.Root show={tocVisible} as={Fragment}>

        <Portal>
        <Dialog as='div' className='relative z-[120] lg:hidden' onClose={changeTocVisible}>
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='heo-toc-drawer__overlay fixed inset-0' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-x-0 bottom-0 z-[121] flex justify-end px-4 pb-[5.5rem]'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-[cubic-bezier(0.22,1,0.36,1)] duration-400'
                  enterFrom='translate-y-6 opacity-0 scale-[0.985]'
                  enterTo='translate-y-0 opacity-100 scale-100'
                  leave='transform transition ease-in-out duration-250'
                  leaveFrom='translate-y-0 opacity-100 scale-100'
                  leaveTo='translate-y-4 opacity-0 scale-[0.985]'>
                  <Dialog.Panel className='heo-toc-drawer__panel pointer-events-auto w-full max-w-xs overflow-hidden'>
                    <div className='heo-toc-drawer__header'>
                      <div className='flex items-center justify-between gap-3'>
                        <div>
                          <div className='heo-toc-drawer__eyebrow'>TABLE OF CONTENTS</div>
                          <div className='heo-toc-drawer__title'>文章目录</div>
                        </div>
                        <button
                          type='button'
                          onClick={() => changeTocVisible(false)}
                          aria-label='关闭文章目录'
                          title='关闭文章目录'
                          className='heo-toc-drawer__close'>
                          <i className='fa-solid fa-xmark text-sm'></i>
                        </button>
                      </div>
                    </div>
                    <div className='heo-toc-drawer__content'>
                      <div className='heo-toc-drawer__content-card'>
                        <div className='dark:text-slate-200'>
                          <Catalog toc={post.toc} showHeader={false} variant='drawer' />
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
        </Portal>
      </Transition.Root>
    </>
  )
}
