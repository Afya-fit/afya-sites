import React from 'react'
import { useBuilder } from './context/BuilderProvider'
import { isAddable } from '../renderer/sectionRegistry'
import HeroEditor from './InlineEditors/HeroEditor'
import ContentBlockEditor from './InlineEditors/ContentBlockEditor'
import BusinessDataEditor from './InlineEditors/BusinessDataEditor'
import LinksPageEditor from './InlineEditors/LinksPageEditor'
import ScheduleEditor from './InlineEditors/ScheduleEditor'

export default function SectionManager() {
  const { draft, addSection, removeSection, selectedIndex, setSelectedIndex, reorderSections } = useBuilder()
  const sections = draft?.sections || []
  const hasLinks = sections.some(s => s.type === 'links_page')
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [dropIndex, setDropIndex] = React.useState<number | null>(null)
  const [dropAtEnd, setDropAtEnd] = React.useState<boolean>(false)

  const handleDropReorder = (fromIndex: number, toIndex: number) => {
    if (!Array.isArray(sections) || fromIndex === toIndex) return
    // Prevent dragging the links_page and prevent dropping into index 0
    const fromItem = sections[fromIndex]
    if (!fromItem || fromItem.type === 'links_page') return
    const safeToIndex = Math.max(1, toIndex)
    const next = [...sections]
    const [moved] = next.splice(fromIndex, 1)
    // Adjust index if removing before insertion point
    const adjustedIndex = fromIndex < safeToIndex ? safeToIndex - 1 : safeToIndex
    next.splice(adjustedIndex, 0, moved)
    // Enforce links_page stays at top if present
    const linkIdx = next.findIndex(s => s.type === 'links_page')
    if (linkIdx > 0) {
      const [link] = next.splice(linkIdx, 1)
      next.unshift(link)
    }
    reorderSections(next as any)
  }
  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <strong>Sections</strong>
        {isAddable('hero') && <button
          onClick={() => {
            addSection({ type: 'hero', title: 'New Hero', subtitle: 'Edit me', align: 'center', valign: 'center', brandEmphasis: true } as any)
            setSelectedIndex(sections.length)
          }}
          style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
        >
          Add Hero
        </button>}
        {isAddable('content_block') && <button
          onClick={() => {
            addSection({ type: 'content_block', title: 'Content Block', body: 'Write copy here', layout: 'media_top', background: 'surface', textAlign: 'left', media: [] } as any)
            setSelectedIndex(sections.length)
          }}
          style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
        >
          Add Content Block
        </button>}
        {isAddable('business_data') && <button
          onClick={() => {
            addSection({ type: 'business_data', title: 'Business', fields: ['business_info'] } as any)
            setSelectedIndex(sections.length)
          }}
          style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
        >
          Add Business Data
        </button>}
        {isAddable('schedule') && <button
          onClick={() => {
            addSection({ type: 'schedule', title: 'Schedule', windowDays: 7 } as any)
            setSelectedIndex(sections.length)
          }}
          style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
        >
          Add Schedule
        </button>}
        <button
          onClick={() => {
            if (hasLinks) return
            // insert at top and select it
            const next = [{ type: 'links_page', title: 'Links', links: [] } as any, ...sections.filter(s => s.type !== 'links_page')]
            reorderSections(next as any)
            setSelectedIndex(0)
          }}
          disabled={hasLinks}
          title={hasLinks ? 'Only one Links List allowed' : 'Add a Link-in-bio list at the top'}
          style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
        >
          Add Links List
        </button>
      </div>
      {sections.length === 0 ? (
        <div style={{ marginTop: 8, opacity: .7 }}>No sections yet. Click “Add Hero” to start.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
          {sections.map((s, i) => (
            <li
              key={i}
              draggable={s.type !== 'links_page'}
              onDragStart={(e) => {
                if (s.type === 'links_page') { e.preventDefault(); return }
                setDragIndex(i)
                setSelectedIndex(null)
                try { e.dataTransfer?.setData('text/plain', String(i)) } catch {}
              }}
              onDragOver={(e) => { e.preventDefault(); setDropIndex(i); setDropAtEnd(false) }}
              onDrop={(e) => {
                e.preventDefault()
                const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1)
                setDragIndex(null); setDropIndex(null); setDropAtEnd(false)
                if (Number.isNaN(from) || from < 0) return
                handleDropReorder(from, i)
              }}
              onDragEnd={() => { setDragIndex(null); setDropIndex(null); setDropAtEnd(false) }}
              style={{ padding: '6px 0', borderTop: i? '1px solid var(--sb-color-border)' : undefined }}
            >
              {dragIndex != null && dropIndex === i && i !== 0 ? (
                <div style={{ height: 8, margin: '0 0 6px 0', borderTop: '2px solid #111', borderRadius: 2, opacity: .8 }} />
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: selectedIndex===i?'#f5f5f5':'transparent' }}>
                <span style={{ width: 24, textAlign: 'right', opacity: .6 }}>{i+1}.</span>
                <button
                  onClick={() => setSelectedIndex(selectedIndex===i ? null : i)}
                  style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'capitalize', padding: 0 }}
                  title={s.type==='links_page' ? 'Links List renders only when selected' : undefined}
                >
                  {s.type === 'links_page' ? 'links list (link-in-bio)' : s.type.replace('_', ' ')}
                </button>
                {'title' in s && (s as any).title ? <span style={{ opacity: .7 }}>— {(s as any).title}</span> : null}
                <button onClick={() => removeSection(i)} style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Remove</button>
              </div>
              {selectedIndex === i && (
                <SectionEditorContainer sectionType={s.type as any} />
              )}
            </li>
          ))}
        </ul>
      )}
      {dragIndex != null && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDropAtEnd(true); setDropIndex(sections.length) }}
          onDrop={(e) => {
            e.preventDefault()
            const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1)
            setDragIndex(null); setDropIndex(null); setDropAtEnd(false)
            if (Number.isNaN(from) || from < 0) return
            handleDropReorder(from, sections.length)
          }}
          style={{
            marginTop: 6,
            padding: '8px 8px',
            border: '1px dashed var(--sb-color-border)',
            borderRadius: 6,
            textAlign: 'center',
            background: dropAtEnd ? '#fafafa' : 'transparent',
            color: 'var(--sb-color-text)',
            fontSize: 12,
          }}
        >
          Drop here to place last
        </div>
      )}
    </div>
  )
}

function SectionEditorContainer({ sectionType }: { sectionType: string }) {
  const { panelView, setPanelView } = useBuilder() as any
  if (panelView === 'media') {
    return (
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setPanelView('editor')} style={{ padding: '4px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}>
            ← Back
          </button>
          <strong style={{ marginLeft: 4 }}>Image settings</strong>
        </div>
        <InlineImageSettings />
      </div>
    )
  }
  return (
    <div>
      {sectionType === 'hero' && <HeroEditor />}
      {sectionType === 'content_block' && <ContentBlockEditor />}
      {sectionType === 'business_data' && <BusinessDataEditor />}
      {sectionType === 'links_page' && <LinksPageEditor />}
      {sectionType === 'schedule' && <ScheduleEditor />}
    </div>
  )
}

function InlineImageSettings() {
  // Reuse the existing panel component but render its inner content inline
  // We'll import and render ImageSettingsPanel inline without the overlay/backdrop
  const Panel = require('./ImageSettingsPanel').default
  return <Panel inline />
}


