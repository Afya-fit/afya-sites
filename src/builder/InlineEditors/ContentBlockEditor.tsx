import React from 'react'
import { useBuilder } from '../context/BuilderProvider'
import { TextareaWithCounter } from '../components/CharacterCounter'
import { CHARACTER_LIMITS } from '../../renderer/types'

export default function ContentBlockEditor() {
  const { draft, selectedIndex, updateSection, setPanelView } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'content_block') return null
  const block = draft.sections[selectedIndex] as any
  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Content Block Editor</strong>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
        <label>Section slug (anchor)
          <input
            value={block.slug || ''}
            onChange={e => {
              const raw = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
              ;(e.target as HTMLInputElement).value = raw
              updateSection(selectedIndex, { slug: raw })
            }}
            placeholder="e.g. ourstory"
            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
          />
        </label>
        <TextareaWithCounter
          label="Title"
          value={block.title || ''}
          maxLength={CHARACTER_LIMITS.CONTENT_TITLE}
          onChange={e => updateSection(selectedIndex, { title: e.target.value })}
          helperText="Section headline"
          style={{ minHeight: '60px' }}
        />
        
        <TextareaWithCounter
          label="Body"
          value={block.body || ''}
          maxLength={CHARACTER_LIMITS.CONTENT_BODY}
          onChange={e => updateSection(selectedIndex, { body: e.target.value })}
          helperText="Main content and description"
          style={{ minHeight: '120px' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <label>Text align
          <select value={block.textAlign || 'left'} onChange={e => updateSection(selectedIndex, { textAlign: e.target.value as any })}>
            <option value='left'>left</option>
            <option value='center'>center</option>
            <option value='right'>right</option>
          </select>
        </label>
        <label>Layout
          <select value={block.layout || 'media_top'} onChange={e => updateSection(selectedIndex, { layout: e.target.value as any })}>
            <option value='media_left'>media_left</option>
            <option value='media_right'>media_right</option>
            <option value='media_top'>media_top</option>
            <option value='text_only'>text_only</option>
          </select>
        </label>
        <label>Background
          <select value={block.background || 'surface'} onChange={e => updateSection(selectedIndex, { background: e.target.value as any })}>
            <option value='surface'>surface</option>
            <option value='alt'>alt</option>
            <option value='inverse'>inverse</option>
          </select>
        </label>
        <div style={{ gridColumn: '1 / -1' }}>
          <button onClick={() => setPanelView('media')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Configure media…</button>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={block.brandEmphasis || false}
              onChange={e => updateSection(selectedIndex, { brandEmphasis: e.target.checked })}
            />
            <span style={{ marginLeft: 8 }}>Brand Emphasis</span>
          </label>
        </div>
      </div>
    </div>
  )
}


