import React from 'react'
import { render } from '@testing-library/react'
import BrandThemeProvider from '../../src/renderer/theme/BrandThemeProvider'

describe('BrandThemeProvider', () => {
  it('sets tokens for light mode with preset accent', () => {
    const config: any = { version: '1', business_id: 'x', theme: { mode: 'light', accent: 'clean' } }
    const { container } = render(
      <BrandThemeProvider config={config}>
        <div>child</div>
      </BrandThemeProvider>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--sb-color-surface')).toBe('#ffffff')
    expect(wrapper.style.getPropertyValue('--sb-color-text')).toBe('#111111')
    expect(wrapper.style.getPropertyValue('--sb-color-neutral')).toBe('#6b7280')
    expect(wrapper.style.getPropertyValue('--sb-color-brand')).toBe('#0ea5e9')
    expect(wrapper.style.getPropertyValue('--sb-color-brand-contrast')).toBe('#ffffff')
  })

  it('sets tokens for dark mode with preset accent', () => {
    const config: any = { version: '1', business_id: 'x', theme: { mode: 'dark', accent: 'clean' } }
    const { container } = render(
      <BrandThemeProvider config={config}>
        <div>child</div>
      </BrandThemeProvider>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--sb-color-surface')).toBe('#0f1115')
    expect(wrapper.style.getPropertyValue('--sb-color-text')).toBe('#eaeaea')
    expect(wrapper.style.getPropertyValue('--sb-color-neutral')).toBe('#94a3b8')
    expect(wrapper.style.getPropertyValue('--sb-color-brand')).toBe('#7dd3fc')
    expect(wrapper.style.getPropertyValue('--sb-color-brand-contrast')).toBe('#111111')
  })

  it('respects explicit brand preset and computes contrast', () => {
    const config: any = { version: '1', business_id: 'x', theme: { mode: 'light', accent: 'brand' } }
    const { container } = render(
      <BrandThemeProvider config={config}>
        <div>child</div>
      </BrandThemeProvider>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--sb-color-brand')).toBe('#2563eb')
    expect(wrapper.style.getPropertyValue('--sb-color-brand-contrast')).toBe('#ffffff')
  })

  it('accepts custom hex accents (light) and computes contrast', () => {
    const config: any = { version: '1', business_id: 'x', theme: { mode: 'light', accent: '#ff0000' } }
    const { container } = render(
      <BrandThemeProvider config={config}>
        <div>child</div>
      </BrandThemeProvider>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--sb-color-brand')).toBe('#ff0000')
    expect(wrapper.style.getPropertyValue('--sb-color-brand-contrast')).toBe('#ffffff')
  })

  it('accepts custom hex accents (dark) and computes contrast', () => {
    const config: any = { version: '1', business_id: 'x', theme: { mode: 'dark', accent: '#00ff00' } }
    const { container } = render(
      <BrandThemeProvider config={config}>
        <div>child</div>
      </BrandThemeProvider>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--sb-color-brand')).toBe('#00ff00')
    expect(wrapper.style.getPropertyValue('--sb-color-brand-contrast')).toBe('#111111')
  })
})


