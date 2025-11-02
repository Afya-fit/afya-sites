import React from 'react'
import { useBuilder } from './context/BuilderProvider'

export default function BrandingPanel() {
  const { draft, updateTheme, openImageManager } = useBuilder() as any
  const theme = (draft?.theme as any) || { theme_version: '1.1', mode: 'light', accent: 'blue', logo_url: '' }
  const typography = theme.typography || { preset: 'modern', displayScale: 'standard', textScale: 'standard', adaptiveTitles: true }
  const computedBrand = resolveAccent(String(theme.accent || 'blue'), String(theme.mode || 'light') as 'light'|'dark')
  const secondary = adjustLightness(computedBrand, (theme.mode||'light') === 'dark' ? 0.2 : -0.2)
  const neutral = (theme.mode||'light') === 'dark' ? '#94a3b8' : '#6b7280'

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label>Mode</label><br />
          <select value={theme.mode} onChange={e => updateTheme({ mode: e.target.value })}>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
        </div>
        <div>
          <label>Accent (name or hex)</label><br />
          <input
            value={theme.accent || ''}
            onChange={e => updateTheme({ accent: e.target.value })}
            style={{ minWidth: 140 }}
          />
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', width:'100%', maxWidth:'100%' }}>
          <PresetChip label="Blue" onClick={() => updateTheme({ accent: 'blue' })} active={theme.accent==='blue'} color={resolveAccent('blue', theme.mode||'light')} />
          <PresetChip label="Green" onClick={() => updateTheme({ accent: 'green' })} active={theme.accent==='green'} color={resolveAccent('green', theme.mode||'light')} />
          <PresetChip label="Purple" onClick={() => updateTheme({ accent: 'purple' })} active={theme.accent==='purple'} color={resolveAccent('purple', theme.mode||'light')} />
          <PresetChip label="Orange" onClick={() => updateTheme({ accent: 'orange' })} active={theme.accent==='orange'} color={resolveAccent('orange', theme.mode||'light')} />
          <PresetChip label="Red" onClick={() => updateTheme({ accent: 'red' })} active={theme.accent==='red'} color={resolveAccent('red', theme.mode||'light')} />
          <PresetChip label="Neutral" onClick={() => updateTheme({ accent: 'neutral' })} active={theme.accent==='neutral'} color={resolveAccent('neutral', theme.mode||'light')} />
        </div>
        <div>
          <label>Accent Picker</label><br />
          <input
            type='color'
            value={/^#([0-9a-fA-F]{6})$/.test(theme.accent) ? theme.accent : '#6d3aff'}
            onChange={e => updateTheme({ accent: e.target.value })}
            title='Pick accent color'
          />
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }}>
          <div>
            <label style={{ display:'block', fontSize:12 }}>Primary</label>
            <div title={computedBrand} style={{ width: 40, height: 22, borderRadius: 4, border: '1px solid #cbd5e1', background: computedBrand }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12 }}>Secondary</label>
            <div title={secondary} style={{ width: 40, height: 22, borderRadius: 4, border: '1px solid #cbd5e1', background: secondary }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12 }}>Neutral</label>
            <div title={neutral} style={{ width: 40, height: 22, borderRadius: 4, border: '1px solid #cbd5e1', background: neutral }} />
          </div>
        </div>
        <div style={{ width:'100%' }}>
          <ContrastBadge brand={computedBrand} mode={theme.mode||'light'} />
        </div>
        <div style={{ width:'100%', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Typography Hierarchy</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <div>
              <label>Font Preset</label><br />
              <select value={typography.preset} onChange={e => updateTheme({ typography: { ...typography, preset: e.target.value } })}>
                <option value='modern'>Modern</option>
                <option value='classic'>Classic</option>
                <option value='minimal'>Minimal</option>
                <option value='energetic'>Energetic</option>
                <option value='friendly'>Friendly</option>
                <option value='system'>System</option>
              </select>
            </div>
            <div>
              <label>Display Scale (Titles & Headings)</label><br />
              <select 
                value={typography.displayScale || 'standard'} 
                onChange={e => updateTheme({ typography: { ...typography, displayScale: e.target.value } })}
              >
                <option value='compact'>Compact - Professional</option>
                <option value='standard'>Standard - Balanced</option>
                <option value='expressive'>Expressive - Creative</option>
                <option value='dramatic'>Dramatic - Bold</option>
              </select>
            </div>
            <div>
              <label>Text Scale (Body & Content)</label><br />
              <select 
                value={typography.textScale || 'standard'} 
                onChange={e => updateTheme({ typography: { ...typography, textScale: e.target.value } })}
              >
                <option value='compact'>Compact - Dense</option>
                <option value='standard'>Standard - Balanced</option>
                <option value='comfortable'>Comfortable - Spacious</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={typography.adaptiveTitles !== false} 
                onChange={e => updateTheme({ typography: { ...typography, adaptiveTitles: e.target.checked } })}
              />
              <span style={{ fontSize: 14 }}>Adaptive Title Sizing (scales based on text length)</span>
            </label>
          </div>
        </div>
        <div style={{ flexGrow: 1, minWidth: 260, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
          <label style={{ display:'block' }}>Logo</label>
          <LogoPicker
            url={theme.logo_url}
            onSelect={(url: string) => updateTheme({ logo_url: url })}
            onClear={() => updateTheme({ logo_url: '' })}
            openPicker={() => openImageManager({ mode: 'picker', onSelect: (url: string) => updateTheme({ logo_url: url }) })}
          />
        </div>
      </div>
    </div>
  )
}

function LogoPicker({ url, onSelect, onClear, openPicker }: { url?: string; onSelect: (url: string) => void; onClear: () => void; openPicker: () => void }) {
  const fileInputRef = React.useRef<HTMLInputElement|null>(null)
  const triggerFile = () => fileInputRef.current?.click()
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/^image\//.test(f.type)) { alert('Please select an image file'); return }
    // Reuse existing upload flow by opening picker; inline upload can be added later
    openPicker()
    e.currentTarget.value = ''
  }
  return (
    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
      <div style={{ width:72, height:72, border:'1px solid #e2e8f0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#f8fafc' }}>
        {url ? <img src={url} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} alt='logo' /> : <span style={{ fontSize:10, color:'#94a3b8' }}>No Logo</span>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, flexGrow:1 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button type='button' onClick={openPicker} style={btnStyle}>Choose</button>
          <button type='button' onClick={triggerFile} style={btnStyle}>Upload</button>
          {url && <button type='button' onClick={onClear} style={btnStyle}>Clear</button>}
        </div>
        <small style={{ fontSize:11, color:'#64748b' }}>PNG/SVG recommended. Transparent background preferred. Displayed at ~40px height.</small>
      </div>
      <input ref={fileInputRef} type='file' accept='image/*' style={{ display:'none' }} onChange={handleFile} />
    </div>
  )
}

const btnStyle: React.CSSProperties = { background:'#fff', border:'1px solid #cbd5e1', borderRadius:4, padding:'4px 10px', fontSize:12, cursor:'pointer' }

function PresetChip({ label, onClick, active, color }: { label: string; onClick: () => void; active?: boolean; color: string }) {
  return (
    <button type='button' onClick={onClick} title={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: active ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: 16,
        padding: '4px 8px', fontSize: 12, cursor: 'pointer'
      }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: color, border: '1px solid #cbd5e1' }} />
      {label}
    </button>
  )
}

function resolveAccent(accent: string, mode: 'light'|'dark') {
  const presets: Record<string, string> = {
    clean: mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
    vibrant: mode === 'dark' ? '#f59e0b' : '#d97706',
    contrast: mode === 'dark' ? '#22d3ee' : '#0891b2',
    brand: '#2563eb',
    gray: '#6b7280',
  }
  const s = String(accent || '').trim()
  if (/^#([0-9a-fA-F]{6})$/.test(s)) return s.toLowerCase()
  return presets[s] || presets.clean
}

function ContrastBadge({ brand, mode }: { brand: string; mode: 'light'|'dark' }) {
  const surface = mode === 'dark' ? '#0f1115' : '#ffffff'
  const textOnSurface = getContrastColor(surface)
  const textOnBrand = getContrastColor(brand)
  const ratioBrand = contrastRatio(brand, textOnBrand)
  const ratioSurface = contrastRatio(surface, textOnSurface)
  const passAA = (r: number) => r >= 4.5
  const badge = (label: string, ok: boolean, r: number) => (
    <span style={{
      fontSize: 11,
      padding: '2px 6px',
      borderRadius: 12,
      background: ok ? '#e6fffa' : '#fff7ed',
      border: `1px solid ${ok ? '#99f6e4' : '#fed7aa'}`,
      color: ok ? '#0f766e' : '#9a3412'
    }}>{label}: {r.toFixed(2)} {ok ? 'PASS' : 'FAIL'}</span>
  )
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      {badge('Brand contrast', passAA(ratioBrand), ratioBrand)}
      {badge('Surface contrast', passAA(ratioSurface), ratioSurface)}
    </div>
  )
}

// WCAG helpers
function relLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const toLin = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b)
}
function contrastRatio(bg: string, fg: string) {
  const L1 = relLuminance(bg)
  const L2 = relLuminance(fg)
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1]
  return (hi + 0.05) / (lo + 0.05)
}
function hexToRgb(hex: string) {
  const m = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}
function getContrastColor(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const srgb = [r, g, b].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
  return lum > 0.55 ? '#111111' : '#ffffff'
}

// color helpers used for secondary preview
function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) => x.toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}
function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }
function adjustLightness(hex: string, delta: number) {
  const { r, g, b } = hexToRgb(hex)
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  let l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break
      case gn: h = (bn - rn) / d + 2; break
      case bn: h = (rn - gn) / d + 4; break
    }
    h /= 6
  }
  l = clamp01(l + delta)
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r2: number, g2: number, b2: number
  if (s === 0) {
    r2 = g2 = b2 = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r2 = hue2rgb(p, q, h + 1 / 3)
    g2 = hue2rgb(p, q, h)
    b2 = hue2rgb(p, q, h - 1 / 3)
  }
  return rgbToHex(Math.round(r2 * 255), Math.round(g2 * 255), Math.round(b2 * 255))
}


