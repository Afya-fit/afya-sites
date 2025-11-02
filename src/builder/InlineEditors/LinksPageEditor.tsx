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
        <label>Section slug (anchor)
          <input
            value={page.slug || ''}
            onChange={e => {
              const raw = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
              ;(e.target as HTMLInputElement).value = raw
              updateSection(selectedIndex, { slug: raw })
            }}
            placeholder="e.g. links"
            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
          />
        </label>
        <label>Variant
          <select value={page.variant || 'pill'} onChange={e => updateSection(selectedIndex, { variant: e.target.value })}>
            <option value='pill'>pill</option>
            <option value='list'>list</option>
          </select>
        </label>
        <label>Align
          <select value={page.align || 'center'} onChange={e => updateSection(selectedIndex, { align: e.target.value })}>
            <option value='center'>center</option>
            <option value='left'>left</option>
          </select>
        </label>
        <label>Size
          <select value={page.size || 'md'} onChange={e => updateSection(selectedIndex, { size: e.target.value })}>
            <option value='sm'>sm</option>
            <option value='md'>md</option>
            <option value='lg'>lg</option>
          </select>
        </label>
        <label>Desktop columns
          <select value={page.columnsDesktop || 'auto'} onChange={e => updateSection(selectedIndex, { columnsDesktop: e.target.value })}>
            <option value='auto'>auto</option>
            <option value='two'>2 columns</option>
          </select>
        </label>
        <label>Color mode
          <select value={page.colorMode || 'neutral'} onChange={e => updateSection(selectedIndex, { colorMode: e.target.value })}>
            <option value='neutral'>neutral</option>
            <option value='brand'>brand</option>
          </select>
        </label>
        <label>Hover style
          <select value={page.hoverStyle || 'tint'} onChange={e => updateSection(selectedIndex, { hoverStyle: e.target.value })}>
            <option value='tint'>tint</option>
            <option value='underline'>underline</option>
          </select>
        </label>
        <label>Truncate lines
          <select value={String(page.truncateLines || 1)} onChange={e => updateSection(selectedIndex, { truncateLines: Number(e.target.value) })}>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </select>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type='checkbox' checked={!!page.emphasizeFirst} onChange={e => updateSection(selectedIndex, { emphasizeFirst: e.target.checked })} /> Emphasize first link
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type='checkbox' checked={!!page.showIcon} onChange={e => updateSection(selectedIndex, { showIcon: e.target.checked })} /> Show icons
        </label>
        <label>Icon position
          <select value={page.iconPosition || 'left'} onChange={e => updateSection(selectedIndex, { iconPosition: e.target.value })}>
            <option value='left'>left</option>
            <option value='top'>top</option>
          </select>
        </label>
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
                {/* optional per-link icon override */}
                <input
                  value={(link as any).iconName || ''}
                  onChange={e => {
                    const nextList: any[] = [...links as any]
                    nextList[idx] = { ...(nextList[idx] || {}), iconName: e.target.value }
                    setLinks(nextList as any)
                  }}
                  placeholder='icon name (e.g., instagram or lucide:phone)'
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


