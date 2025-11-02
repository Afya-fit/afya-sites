import React from 'react'
import { render } from '@testing-library/react'
import LinksPage from '../../src/renderer/components/sections/links-page'

describe('LinksPage', () => {
  it('renders links with tokenized styles', () => {
    const section = {
      type: 'links_page' as const,
      title: 'Quick Links',
      links: [
        { id: 'a', label: 'Book', href: '#book' },
        { id: 'b', label: 'Contact', href: '#contact' },
      ],
    }
    const { asFragment, getByText } = render(<LinksPage section={section} />)
    expect(getByText('Quick Links')).toBeInTheDocument()
    expect(getByText('Book')).toBeInTheDocument()
    expect(getByText('Contact')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})


