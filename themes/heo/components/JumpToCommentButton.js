import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToCommentButton = () => {
  if (!siteConfig('HEO_WIDGET_TO_COMMENT', null, CONFIG)) {
    return <></>
  }

  function navToComment() {
    if (document.getElementById('comment')) {
      window.scrollTo({ top: document.getElementById('comment').offsetTop, behavior: 'smooth' })
    }
    // 兼容性不好
    // const commentElement = document.getElementById('comment')
    // if (commentElement) {
    // commentElement?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    // }
  }

  return (
    <button
      type='button'
      aria-label='跳转到评论区'
      title='跳转到评论区'
      className='heo-float-widget-btn heo-float-widget-btn--icon-only'
      onClick={navToComment}>
      <i className='heo-float-widget-btn__icon fas fa-comment' />
    </button>
  )
}

export default JumpToCommentButton
