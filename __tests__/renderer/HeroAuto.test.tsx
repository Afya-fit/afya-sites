import React from 'react'
import { render } from '@testing-library/react'
import Hero from '../../src/renderer/components/sections/Hero'

describe('Hero auto text color', () => {
  it('renders with auto mode and falls back to token color on SSR/jsdom', () => {
    const { getByText, asFragment } = render(
      <Hero section={{ type: 'hero', title: 'Auto Title', textColorMode: 'auto', backgroundImageUrl: '/assets/hero.jpg' }} />
    )
    expect(getByText('Auto Title')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
