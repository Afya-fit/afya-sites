import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BuilderProvider from '../../src/builder/context/BuilderProvider'
import SectionManager from '../../src/builder/SectionManager'

describe('SectionManager accordion + media panel', () => {
  const seed = (sections: any[]) => {
    localStorage.setItem('sb:biz', JSON.stringify({ slug: 'demo', draft: { version: '1.0', business_id: 'biz', theme: {}, sections } }))
  }

  it('toggles inline editor open/close on section row click', () => {
    seed([{ type: 'hero', title: 'Hero' }, { type: 'content_block', title: 'Block' }])
    const ui = render(
      <BuilderProvider businessId={'biz'}>
        <SectionManager />
      </BuilderProvider>
    )
    // Initially closed
    expect(ui.queryByText('Hero Editor')).not.toBeInTheDocument()
    // Open hero (disambiguate from "Add Hero" control)
    fireEvent.click(ui.getAllByRole('button', { name: /hero/i })[1])
    expect(ui.getByText('Hero Editor')).toBeInTheDocument()
    // Close hero
    fireEvent.click(ui.getAllByRole('button', { name: /hero/i })[1])
    expect(ui.queryByText('Hero Editor')).not.toBeInTheDocument()
  })

  it('switches to inline media settings and back', () => {
    seed([{ type: 'hero', title: 'Hero' }])
    const ui = render(
      <BuilderProvider businessId={'biz'}>
        <SectionManager />
      </BuilderProvider>
    )
    // Open hero editor (disambiguate from "Add Hero")
    fireEvent.click(ui.getAllByRole('button', { name: /hero/i })[1])
    // Go to media settings
    fireEvent.click(ui.getByRole('button', { name: /configure media/i }))
    expect(ui.getByText('Image settings')).toBeInTheDocument()
    // Back to editor
    fireEvent.click(ui.getByRole('button', { name: /back/i }))
    expect(ui.getByText('Hero Editor')).toBeInTheDocument()
  })
})


