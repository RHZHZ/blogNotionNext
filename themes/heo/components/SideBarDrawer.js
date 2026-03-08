import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'

/**
 * 侧边栏抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const SideBarDrawer = ({ children, isOpen, onOpen, onClose, className = '' }) => {
  const router = useRouter()

  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      onClose && onClose()
    }
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener)
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener)
    }
  }, [onClose, router.events])

  useEffect(() => {
    if (isOpen) {
      onOpen && onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <Transition.Root show={!!isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-30 md:hidden' onClose={onClose || (() => {})}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-slate-950/50 backdrop-blur-md dark:bg-black/65' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-[cubic-bezier(0.22,1,0.36,1)] duration-500'
                enterFrom='translate-x-full opacity-0 scale-[0.985]'
                enterTo='translate-x-0 opacity-100 scale-100'
                leave='transform transition ease-in-out duration-300'
                leaveFrom='translate-x-0 opacity-100 scale-100'
                leaveTo='translate-x-full opacity-0 scale-[0.99]'>
                <Dialog.Panel
                  className={`pointer-events-auto relative h-full w-[86vw] max-w-sm overflow-hidden rounded-l-[2rem] border-l border-slate-200/70 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-[#eef2f7] shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-slate-700/40 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#0b1120] dark:shadow-[0_24px_72px_rgba(0,0,0,0.4)] ${className}`}>
                  <div className='h-full overflow-y-auto px-4 py-4 sm:px-5'>
                    {children}
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

export default SideBarDrawer
