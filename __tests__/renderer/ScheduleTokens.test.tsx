import React from 'react'
import { TextDecoder, TextEncoder } from 'util'
;(global as any).TextEncoder = TextEncoder as any
;(global as any).TextDecoder = TextDecoder as any
import Schedule from '../../src/renderer/components/sections/Schedule'

describe('Schedule tokens usage', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-09-13T10:00:00Z'))
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('uses token variables for chip and text colors (SSR markup)', () => {
    const section: any = { type: 'schedule', title: 'Schedule', windowDays: 2, viewMode: 'stacked' }
    const now = new Date()
    const data = {
      platform_data: {
        schedule: [
          { id: 'a', title: 'Class A', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString() },
        ]
      }
    }
    const { renderToStaticMarkup } = require('react-dom/server')
    const html = renderToStaticMarkup(<Schedule section={section} data={data} />)
    // Title style contains token color
    expect(html).toMatch(/<h2[^>]*style="[^"]*color:\s*var\(--sb-color-text\)/)
    // Chip contains token background and color
    expect(html).toMatch(/<button[^>]*style="[^"]*background:\s*var\(--sb-color-(brand|surface)\)/)
    expect(html).toMatch(/<button[^>]*style="[^"]*color:\s*var\(--sb-color-(brand-contrast|text)\)/)
    // Badge contains tokenized bg, text, and border
    expect(html).toMatch(/<span[^>]*style="[^"]*background:\s*var\(--sb-color-surface-alt\)/)
    expect(html).toMatch(/<span[^>]*style="[^"]*color:\s*var\(--sb-color-text\)/)
    expect(html).toMatch(/<span[^>]*style="[^"]*border:\s*1px\s*solid\s*var\(--sb-color-border\)/)
  })
})
