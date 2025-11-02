import React from 'react'
import { useBuilder } from '../context/BuilderProvider'

export default function BusinessDataEditor() {
  const { draft, selectedIndex, updateSection, platformData } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'business_data') return null
  const sec = draft.sections[selectedIndex] as any

  const toggleField = (key: string) => {
    const set = new Set<string>(Array.isArray(sec.fields) ? sec.fields : [])
    const wasOn = set.has(key)
    if (wasOn) {
      set.delete(key)
      updateSection(selectedIndex, { fields: Array.from(set) } as any)
    } else {
      set.add(key)
      const patch: any = { fields: Array.from(set) }
      if (key === 'location' && !sec.location) {
        const backendAddr = platformData?.business_info?.address || ''
        const backendPhone = platformData?.business_info?.phone || ''
        const lines = String(backendAddr).split(/\n|,\s*/).map((s: string) => s.trim()).filter(Boolean)
        patch.location = {
          addressLines: lines,
          phone: backendPhone || undefined,
          mapProvider: 'auto',
          actions: { showDirections: true, showCall: !!backendPhone, showCopyAddress: true }
        }
      }
      updateSection(selectedIndex, patch)
    }
  }

  const checked = (key: string) => (Array.isArray(sec.fields) ? sec.fields.includes(key) : false)

  // Auto-prefill address lines from backend business info when empty and Business Info is enabled
  React.useEffect(() => {
    try {
      if (!checked('business_info')) return
      const hasLines = Array.isArray(sec.location?.addressLines) && sec.location.addressLines.length > 0
      const backendAddr = platformData?.business_info?.address || ''
      if (!hasLines && backendAddr) {
        const lines = String(backendAddr).split(/\n|,\s*/).map((s: string) => s.trim()).filter(Boolean)
        if (lines.length > 0) {
          updateSection(selectedIndex, { location: { ...(sec.location||{}), addressLines: lines } } as any)
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformData, selectedIndex])

  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Business Data Editor</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }}>
        <label>Section slug (anchor)
          <input
            value={sec.slug || ''}
            onChange={e => {
              const raw = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
              ;(e.target as HTMLInputElement).value = raw
              updateSection(selectedIndex, { slug: raw })
            }}
            placeholder="e.g. contact"
            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
          />
        </label>
        <label>Title
          <input
            value={sec.title || ''}
            onChange={e => updateSection(selectedIndex, { title: e.target.value })}
            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
          />
        </label>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Include fields</div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('business_info')} onChange={() => toggleField('business_info')} /> Business info
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('programs')} onChange={() => toggleField('programs')} /> Programs
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('products')} onChange={() => toggleField('products')} /> Products
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('schedule')} onChange={() => toggleField('schedule')} /> Schedule
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('contact')} onChange={() => toggleField('contact')} /> Contact
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='checkbox' checked={checked('location')} onChange={() => toggleField('location')} /> Location (Map & Directions)
          </label>
        </div>

        {checked('location') && (
        <div style={{ borderTop:'1px solid #e2e8f0', paddingTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Location (MVP)</div>
          <label>Address lines (one per line)
            <textarea
              value={(sec.location?.addressLines || []).join('\n')}
              onChange={e => {
                const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                const next = { ...(sec.location || {}), addressLines: lines }
                updateSection(selectedIndex, { location: next })
              }}
              rows={3}
              style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
            />
          </label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
            <label>Phone
              <input
                value={sec.location?.phone || ''}
                onChange={e => updateSection(selectedIndex, { location: { ...(sec.location||{}), phone: e.target.value } })}
                placeholder="(555) 555-5555"
                style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
              />
            </label>
            <label>Map provider
              <select
                value={sec.location?.mapProvider || 'auto'}
                onChange={e => updateSection(selectedIndex, { location: { ...(sec.location||{}), mapProvider: e.target.value } })}
              >
                <option value='auto'>auto</option>
                <option value='google'>google</option>
                <option value='apple'>apple</option>
                <option value='waze'>waze</option>
              </select>
            </label>
          </div>
          <div style={{ display:'flex', gap: 12, alignItems:'center', marginTop: 6 }}>
            <label style={{ display:'inline-flex', alignItems:'center', gap: 6 }}>
              <input type='checkbox' checked={!!sec.location?.actions?.showCall} onChange={e => updateSection(selectedIndex, { location: { ...(sec.location||{}), actions: { ...(sec.location?.actions||{}), showCall: e.target.checked } } })} /> Call button
            </label>
            <label style={{ display:'inline-flex', alignItems:'center', gap: 6 }}>
              <input type='checkbox' checked={sec.location?.actions?.showDirections !== false} onChange={e => updateSection(selectedIndex, { location: { ...(sec.location||{}), actions: { ...(sec.location?.actions||{}), showDirections: e.target.checked } } })} /> Directions button
            </label>
            <label style={{ display:'inline-flex', alignItems:'center', gap: 6 }}>
              <input type='checkbox' checked={!!sec.location?.actions?.showCopyAddress} onChange={e => updateSection(selectedIndex, { location: { ...(sec.location||{}), actions: { ...(sec.location?.actions||{}), showCopyAddress: e.target.checked } } })} /> Copy address
            </label>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}


