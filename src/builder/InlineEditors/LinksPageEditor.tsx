import React from 'react'
import { useBuilder } from '../context/BuilderProvider'

type LinkItem = { id: string; label: string; href: string }

export default function LinksPageEditor() {
  const { draft, selectedIndex, updateSection } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'links_page') return null
  const page = draft.sections[selectedIndex] as any
  const links: LinkItem[] = Array.isArray(page.links) ? page.links : []

  const setLinks = (next: LinkItem[]) => updateSection(selectedIndex, { links: next } as any)

  const addLink = () => {
    const id = Math.random().toString(36).slice(2, 8)
    setLinks([...(links || []), { id, label: 'New link', href: '#' }])
  }
  const removeLink = (idx: number) => {
    const next = [...links]
    next.splice(idx, 1)
    setLinks(next)
  }

  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Links Page Editor</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
        <label style={{ gridColumn: '1 / -1' }}>Title
          <input value={page.title || ''} onChange={e => updateSection(selectedIndex, { title: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }} />
        </label>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Links</span>
            <button onClick={addLink} style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Add Link</button>
          </div>
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {links.map((link, idx) => (
              <div key={link.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                <input
                  value={link.label}
                  onChange={e => {
                    const next = [...links]
                    next[idx] = { ...next[idx], label: e.target.value }
                    setLinks(next)
                  }}
                  placeholder='Label'
                  style={{ padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
                />
                <input
                  value={link.href}
                  onChange={e => {
                    const next = [...links]
                    next[idx] = { ...next[idx], href: e.target.value }
                    setLinks(next)
                  }}
                  placeholder='https://…'
                  style={{ padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
                />
                <button onClick={() => removeLink(idx)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


