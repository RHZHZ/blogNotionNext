import { siteConfig } from '@/lib/config'
import { useRef } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

const SocialButton = () => {
  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const CONTACT_LINKEDIN = siteConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = siteConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = siteConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')

  const emailIcon = useRef(null)
  const itemClassName =
    'inline-flex h-9 w-9 items-center justify-center rounded-2xl text-[1.1rem] text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:text-slate-300 dark:hover:text-white dark:focus-visible:ring-amber-400/30'

  return (
    <div className='social-button-group flex w-full flex-wrap justify-center'>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        {CONTACT_GITHUB && (
          <a target='_blank' rel='noreferrer' title='github' href={CONTACT_GITHUB} className={itemClassName}>
            <i className='fab fa-github' />
          </a>
        )}
        {CONTACT_TWITTER && (
          <a target='_blank' rel='noreferrer' title='twitter' href={CONTACT_TWITTER} className={itemClassName}>
            <i className='fab fa-twitter' />
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a target='_blank' rel='noreferrer' href={CONTACT_TELEGRAM} title='telegram' className={itemClassName}>
            <i className='fab fa-telegram' />
          </a>
        )}
        {CONTACT_LINKEDIN && (
          <a target='_blank' rel='noreferrer' href={CONTACT_LINKEDIN} title='linkIn' className={itemClassName}>
            <i className='fab fa-linkedin' />
          </a>
        )}
        {CONTACT_WEIBO && (
          <a target='_blank' rel='noreferrer' title='weibo' href={CONTACT_WEIBO} className={itemClassName}>
            <i className='fab fa-weibo' />
          </a>
        )}
        {CONTACT_INSTAGRAM && (
          <a target='_blank' rel='noreferrer' title='instagram' href={CONTACT_INSTAGRAM} className={itemClassName}>
            <i className='fab fa-instagram' />
          </a>
        )}
        {CONTACT_EMAIL && (
          <a onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)} title='email' className={`${itemClassName} cursor-pointer`} ref={emailIcon}>
            <i className='fas fa-envelope' />
          </a>
        )}
        {ENABLE_RSS && (
          <a target='_blank' rel='noreferrer' title='RSS' href='/rss/feed.xml' className={itemClassName}>
            <i className='fas fa-rss' />
          </a>
        )}
        {CONTACT_BILIBILI && (
          <a target='_blank' rel='noreferrer' title='bilibili' href={CONTACT_BILIBILI} className={itemClassName}>
            <i className='fab fa-bilibili' />
          </a>
        )}
        {CONTACT_YOUTUBE && (
          <a target='_blank' rel='noreferrer' title='youtube' href={CONTACT_YOUTUBE} className={itemClassName}>
            <i className='fab fa-youtube' />
          </a>
        )}
      </div>
    </div>
  )
}

export default SocialButton
