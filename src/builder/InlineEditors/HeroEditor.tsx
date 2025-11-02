import React from 'react'
import { useBuilder } from '../context/BuilderProvider'
import { TextareaWithCounter } from '../components/CharacterCounter'
import { CHARACTER_LIMITS } from '../../renderer/types'

export default function HeroEditor() {
  const { draft, selectedIndex, updateSection, setPanelView } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'hero') return null
  const hero = draft.sections[selectedIndex] as any
  const focal = hero.backgroundFocal?.desktop || { xPct: 50, yPct: 50 }
  const _focalMobile = hero.backgroundFocal?.mobile || { xPct: focal.xPct, yPct: focal.yPct }
  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Hero Editor</strong>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
        <label>Section slug (anchor)
          <input
            value={hero.slug || ''}
            onChange={e => {
              const raw = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
              ;(e.target as HTMLInputElement).value = raw
              updateSection(selectedIndex, { slug: raw })
            }}
            placeholder="e.g. hero"
            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
          />
        </label>
        <TextareaWithCounter
          label="Title"
          value={hero.title || ''}
          maxLength={CHARACTER_LIMITS.HERO_TITLE}
          onChange={e => updateSection(selectedIndex, { title: e.target.value })}
          helperText="Keep it short and impactful"
          style={{ minHeight: '60px' }}
        />
        
        <TextareaWithCounter
          label="Subtitle"
          value={hero.subtitle || ''}
          maxLength={CHARACTER_LIMITS.HERO_SUBTITLE}
          onChange={e => updateSection(selectedIndex, { subtitle: e.target.value })}
          helperText="Provide more context and detail"
          style={{ minHeight: '80px' }}
        />
      </div>
      
      {/* Typography Controls: [-] [+] Reset */}
      <div style={{ marginTop: 16, padding: 12, background: '#f8f9fa', borderRadius: 6 }}>
        <strong style={{ fontSize: '13px', display: 'block', marginBottom: 10 }}>Typography</strong>
        {(() => {
          const custom = (hero.typographyOverride && hero.typographyOverride.customScaling) || {}
          const t = custom.title == null ? 1 : custom.title
          const s = custom.subtitle == null ? 1 : custom.subtitle
          const b = custom.body == null ? 1 : custom.body
          const isPreset = (a: number, b: number) => Math.abs(a - b) < 0.001
          const matchesSmaller = isPreset(t, 0.94) && isPreset(s, 0.96) && isPreset(b, 0.98)
          const matchesLarger  = isPreset(t, 1.08) && isPreset(s, 1.04) && isPreset(b, 1.03)

          const baseBtnStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid var(--sb-color-border)', borderRadius: 6, background: '#fff' }
          const activeStyle: React.CSSProperties = { background: '#fff', color: 'var(--sb-color-primary)', border: '1px solid var(--sb-color-primary)', boxShadow: '0 0 0 2px var(--sb-color-primary)', fontWeight: 600 }

          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                title="Nudge smaller"
                onClick={() => updateSection(selectedIndex, {
                  typographyOverride: {
                    ...(hero.typographyOverride || {}),
                    customScaling: { title: 0.94, subtitle: 0.96, body: 0.98 }
                  }
                })}
                style={{ ...baseBtnStyle, ...(matchesSmaller ? activeStyle : null) }}
              >
                [-]
              </button>

              <button
                title="Nudge larger"
                onClick={() => updateSection(selectedIndex, {
                  typographyOverride: {
                    ...(hero.typographyOverride || {}),
                    customScaling: { title: 1.08, subtitle: 1.04, body: 1.03 }
                  }
                })}
                style={{ ...baseBtnStyle, ...(matchesLarger ? activeStyle : null) }}
              >
                [+]
              </button>

              <button
                title="Clear overrides"
                onClick={() => updateSection(selectedIndex, { typographyOverride: undefined })}
                style={baseBtnStyle}
              >
                Reset
              </button>
            </div>
          )
        })()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <label>Layout
          <select value={hero.layout || 'media_top'} onChange={e => updateSection(selectedIndex, { layout: e.target.value })}>
            <option value='media_top'>media_top</option>
            <option value='media_bottom'>media_bottom</option>
            <option value='media_left'>media_left</option>
            <option value='media_right'>media_right</option>
            <option value='text_only'>text_only</option>
          </select>
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
        <label>Text color
          <select value={hero.textColorMode || 'neutral'} onChange={e => updateSection(selectedIndex, { textColorMode: e.target.value as any })}>
            <option value='auto'>Auto</option>
            <option value='neutral'>Neutral (mode)</option>
            <option value='brand'>Brand accent</option>
          </select>
        </label>
      </div>
      
      
      <div style={{ marginTop: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <button onClick={() => setPanelView('media')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Configure media…</button>
        </div>
        {/* Background focal and image settings moved into ImageSettingsPanel */}
      </div>
    </div>
  )
}


