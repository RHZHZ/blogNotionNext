import {
  applyArticleMediaDecorations,
  applyArticleReadingEnhancements,
  applyImageGalleryLayoutToArticle
} from '@/components/NotionPage'


jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null
  DynamicComponent.displayName = 'LoadableComponent'
  DynamicComponent.preload = jest.fn()
  return DynamicComponent
})

jest.mock('react-notion-x', () => ({
  NotionRenderer: () => null
}))

jest.mock('@fisch0920/medium-zoom', () =>
  jest.fn(() => ({
    clone: () => ({ attach: jest.fn() })
  }))
)

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultValue) => defaultValue)
}))

jest.mock('@/lib/utils', () => ({
  isBrowser: false,
  loadExternalResource: jest.fn(() => Promise.resolve())
}))

describe('components/NotionPage helpers', () => {
  const createArticleDom = () => {
    const article = document.createElement('div')
    article.id = 'notion-article'
    article.innerHTML = `
      <figure class="notion-asset-wrapper-image">
        <img alt="demo" src="https://example.com/demo.jpg" />
      </figure>
      <figcaption class="notion-asset-caption">Image Caption</figcaption>
      <div class="notion-row">
        <div class="notion-column">
          <figure class="notion-asset-wrapper-image">
            <img alt="gallery-1" src="https://example.com/gallery-1.jpg" />
          </figure>
        </div>
        <div class="notion-column">
          <figure class="notion-asset-wrapper-image">
            <img alt="gallery-2" src="https://example.com/gallery-2.jpg" />
          </figure>
        </div>
      </div>
      <div class="notion-audio"><audio src="https://example.com/audio.mp3"></audio></div>
      <pre class="notion-code language-js"><code>const value = 1</code></pre>
      <blockquote>Quoted text</blockquote>
      <div class="notion-callout">Callout</div>
      <div class="notion-bookmark">Bookmark</div>
      <div class="notion-pdf">PDF</div>
      <div class="notion-asset-wrapper">
        <iframe title="embed-demo" src="https://example.com/embed"></iframe>
      </div>
    `

    return article
  }

  it('adds heo media markers without breaking gallery structure', () => {
    const article = createArticleDom()

    applyImageGalleryLayoutToArticle({ article, width: 1280 })
    applyArticleMediaDecorations(article)

    expect(article).toHaveAttribute('data-heo-reading-surface', 'true')
    expect(article).toHaveAttribute('data-heo-article-surface', 'article')
    expect(article).toHaveClass('heo-article-surface')
    expect(article.querySelector('.notion-row')).toHaveClass('heo-image-gallery-row')
    expect(article.querySelector('.notion-row')).toHaveAttribute('data-heo-gallery', 'true')
    expect(article.querySelector('.notion-audio')).toHaveAttribute('data-heo-block', 'audio')
    expect(article.querySelector('pre.notion-code')).toHaveAttribute('data-heo-block', 'code')
    expect(article.querySelector('blockquote')).toHaveAttribute('data-heo-block', 'quote')
    expect(article.querySelector('.notion-callout')).toHaveAttribute('data-heo-block', 'callout')
    expect(article.querySelector('.notion-bookmark')).toHaveAttribute('data-heo-block', 'bookmark')
    expect(article.querySelector('.notion-pdf')).toHaveAttribute('data-heo-block', 'pdf')
    expect(article.querySelector('.notion-asset-wrapper')).toHaveAttribute('data-heo-block', 'embed')
    expect(article.querySelector('.notion-asset-caption')).toHaveClass('heo-article-caption')
    expect(
      article.querySelector('.notion-column > figure.notion-asset-wrapper-image')
    ).not.toBeNull()
  })

  it('enables two-column gallery layout on mobile widths', () => {
    const article = createArticleDom()
    const row = article.querySelector('.notion-row')
    const columns = row.querySelectorAll(':scope > .notion-column')

    applyImageGalleryLayoutToArticle({ article, width: 390 })
    applyArticleMediaDecorations(article)

    expect(row).toHaveClass('heo-image-gallery-row')
    expect(row).toHaveAttribute('data-heo-gallery', 'true')
    expect(row.style.getPropertyValue('--heo-gallery-cols')).toBe('2')
    expect(row.style.getPropertyValue('--heo-gallery-gap')).toBe('0.45rem')
    expect(columns).toHaveLength(2)
  })




  it('marks mixed-stack gallery metadata correctly', () => {
    const article = document.createElement('div')
    article.id = 'notion-article'
    article.innerHTML = `
      <div class="notion-row">
        <div class="notion-column">
          <figure class="notion-asset-wrapper-image">
            <img alt="gallery-left-1" src="https://example.com/gallery-left-1.jpg" />
          </figure>
          <figure class="notion-asset-wrapper-image">
            <img alt="gallery-left-2" src="https://example.com/gallery-left-2.jpg" />
          </figure>
        </div>
        <div class="notion-column">
          <figure class="notion-asset-wrapper-image">
            <img alt="gallery-right" src="https://example.com/gallery-right.jpg" />
          </figure>
        </div>
      </div>
    `

    const row = article.querySelector('.notion-row')

    applyImageGalleryLayoutToArticle({ article, width: 1280 })
    applyArticleMediaDecorations(article)

    expect(row).toHaveClass('heo-image-gallery-row')
    expect(row).toHaveAttribute('data-heo-gallery', 'true')
    expect(row).toHaveAttribute('data-heo-gallery-pattern', 'mixed-stack')
    expect(row).toHaveAttribute('data-heo-gallery-mixed', 'true')
    expect(row).toHaveAttribute('data-heo-gallery-stacked-column', 'left')
    expect(row.style.getPropertyValue('--heo-gallery-stack-max')).toBe('2')
  })

  it('cleans stale gallery metadata when row no longer qualifies', () => {
    const article = createArticleDom()
    const row = article.querySelector('.notion-row')
    const secondColumn = row.querySelectorAll(':scope > .notion-column')[1]

    applyImageGalleryLayoutToArticle({ article, width: 1280 })
    applyArticleMediaDecorations(article)

    expect(row).toHaveClass('heo-image-gallery-row')
    expect(row).toHaveAttribute('data-heo-gallery', 'true')
    expect(row).toHaveAttribute('data-heo-block', 'gallery')

    secondColumn.innerHTML = ''

    applyImageGalleryLayoutToArticle({ article, width: 390 })

    expect(row).not.toHaveClass('heo-image-gallery-row')
    expect(row).not.toHaveAttribute('data-heo-gallery')
    expect(row).not.toHaveAttribute('data-heo-gallery-count')
    expect(row).not.toHaveAttribute('data-heo-gallery-pattern')
    expect(row).not.toHaveAttribute('data-heo-block', 'gallery')
    expect(row.style.getPropertyValue('--heo-gallery-cols')).toBe('')
    expect(row.style.getPropertyValue('--heo-gallery-gap')).toBe('')
    expect(row.style.getPropertyValue('--heo-gallery-stack-max')).toBe('')
  })

  it('removes blank placeholder nodes during article enhancement', () => {
    const article = createArticleDom()
    const blank = document.createElement('div')
    blank.className = 'notion-blank'
    blank.innerHTML = '&nbsp;'
    article.appendChild(blank)

    applyArticleReadingEnhancements({ article, width: 1280 })

    expect(article.querySelector('.notion-blank')).toBeNull()
  })

  it('applies reading enhancements through the unified entry', () => {

    const article = createArticleDom()

    applyArticleReadingEnhancements({ article, width: 1280 })

    expect(article).toHaveAttribute('data-heo-reading-surface', 'true')
    expect(article).toHaveAttribute('data-heo-article-surface', 'article')
    expect(article).toHaveClass('heo-article-surface')
    expect(article.querySelector('.notion-row')).toHaveClass('heo-image-gallery-row')
    expect(article.querySelector('.notion-row')).toHaveAttribute('data-heo-gallery', 'true')
  })
})


