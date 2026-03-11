import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  return (
    <footer className='relative m-auto flex w-full flex-col flex-shrink-0 justify-center text-center text-sm leading-6 text-slate-500 dark:text-slate-200'>
      <div id='color-transition' className='h-32 w-full' />
      <div id='footer-bottom' className='w-full items-center px-6 py-4'>
        <div id='footer-bottom-left' className='text-center lg:text-start'>
          <PoweredBy />
          <div className='flex flex-wrap items-center justify-center gap-x-1 lg:justify-start'>
            <CopyRightDate />
            <a href='/about' className='font-semibold text-slate-700 dark:text-slate-200'>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='mx-1 text-slate-400 dark:text-slate-400'> | {BIO}</span>}
          </div>
        </div>

        <div id='footer-bottom-center' className='py-2'>
          <SocialButton />
        </div>

        <div id='footer-bottom-right' className='text-center lg:text-right'>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' /> <a href={BEI_AN_LINK} className='mr-2'>{siteConfig('BEI_AN')}</a>
            </>
          )}
          <BeiAnGongAn />
          <span className='hidden busuanzi_container_site_pv'>
            <i className='fas fa-eye' />
            <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
          </span>
          <span className='pl-2 hidden busuanzi_container_site_uv'>
            <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
