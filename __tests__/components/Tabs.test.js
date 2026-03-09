import { fireEvent, render, screen } from '@testing-library/react'
import Tabs from '@/components/Tabs'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn(key => {
    const config = {
      COMMENT_HIDE_SINGLE_TAB: true
    }
    return config[key]
  })
}))

describe('components/Tabs', () => {
  it('hides tab switcher when only one tab exists and config enabled', () => {
    render(
      <Tabs>
        <div key='Only'>Only Content</div>
      </Tabs>
    )

    expect(screen.queryByRole('button', { name: /Only$/ })).not.toBeInTheDocument()
    expect(screen.getByText('Only Content')).toBeInTheDocument()
  })

  it('switches tabs and applies comment heo style variant', () => {
    render(
      <Tabs variant='comment-heo'>
        <div key='First'>First Content</div>
        <div key='Second'>Second Content</div>
      </Tabs>
    )

    const secondTab = screen.getByRole('button', { name: /Second$/ })
    expect(secondTab.className).toContain('rounded-xl')

    fireEvent.click(secondTab)

    expect(screen.getByText('Second Content')).toBeVisible()
  })
})
