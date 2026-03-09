/** @jest-environment node */

import getPageProperties from '@/lib/db/notion/getPageProperties'

describe('lib/db/notion/getPageProperties', () => {
  it('normalizes notion title rich text into single-line plain text', async () => {
    const schema = {
      titleKey: {
        name: 'Name',
        type: 'title'
      }
    }

    const value = {
      properties: {
        titleKey: [['Hello', [['a'], ['\n'], ['World'], ['  Again  ']]]]
      },
      created_time: '2026-03-09T00:00:00.000Z',
      last_edited_time: '2026-03-09T00:00:00.000Z',
      format: {}
    }

    const result = await getPageProperties('page-1', value, schema, null, [])

    expect(result.Name).toBe('Hello World Again')
  })
})
