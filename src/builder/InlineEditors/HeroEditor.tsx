import React from 'react'
import { useBuilder } from '../context/BuilderProvider'

export default function HeroEditor() {
  const { draft, selectedIndex, updateSection, setPanelView } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'hero') return null
  const hero = draft.sections[selectedIndex] as any
  const focal = hero.backgroundFocal?.desktop || { xPct: 50, yPct: 50 }
  const focalMobile = hero.backgroundFocal?.mobile || { xPct: focal.xPct, yPct: focal.yPct }
  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Hero Editor</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
        <label>Title
          <input value={hero.title || ''} onChange={e => updateSection(selectedIndex, { title: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }} />
        </label>
        <label>Subtitle
          <input value={hero.subtitle || ''} onChange={e => updateSection(selectedIndex, { subtitle: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }} />
        </label>
        <label>Align
          <select value={hero.align || 'center'} onChange={e => updateSection(selectedIndex, { align: e.target.value as any })}>
            <option value='left'>left</option>
            <option value='center'>center</option>
            <option value='right'>right</option>
          </select>
        </label>
        <label>Valign
          <select value={hero.valign || 'center'} onChange={e => updateSection(selectedIndex, { valign: e.target.value as any })}>
            <option value='top'>top</option>
            <option value='center'>center</option>
            <option value='bottom'>bottom</option>
          </select>
        </label>
        <div style={{ gridColumn: '1 / -1' }}>
          <button onClick={() => setPanelView('media')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Configure media…</button>
        </div>
        {/* Background focal and image settings moved into ImageSettingsPanel */}
      </div>
    </div>
  )
}


