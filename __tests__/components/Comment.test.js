import { render, screen } from '@testing-library/react'
import Comment from '@/components/Comment'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn(key => {
    const config = {
      COMMENT_GISCUS_REPO: 'owner/repo',
      COMMENT_HIDE_SINGLE_TAB: false
    }
    return config[key]
  })
}))

jest.mock('@/lib/utils', () => ({
  isBrowser: false,
  isSearchEngineBot: false
}))

describe('components/Comment', () => {

  const frontMatter = { id: 'post-1' }

  it('renders heo loading state before intersection load', () => {
    render(<Comment frontMatter={frontMatter} variant='heo' tabsVariant='comment-heo' />)

    expect(screen.getByText('讨论区正在准备中')).toBeInTheDocument()
    expect(screen.getByText('Discussion Loading')).toBeInTheDocument()
  })

  it('renders custom loading slot before intersection load', () => {
    render(
      <Comment
        frontMatter={frontMatter}
        loadingSlot={<div>Custom Discussion Loading</div>}
      />
    )

    expect(screen.getByText('Custom Discussion Loading')).toBeInTheDocument()
  })

  it('returns null when frontMatter comments are hidden', () => {
    const { container } = render(
      <Comment frontMatter={{ id: 'post-1', comment: 'Hide' }} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
