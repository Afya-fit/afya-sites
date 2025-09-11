import React from 'react'
import { useBuilder } from '../context/BuilderProvider'

export default function BusinessDataEditor() {
  const { draft, selectedIndex, updateSection } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'business_data') return null
  const sec = draft.sections[selectedIndex] as any

  const toggleField = (key: string) => {
    const set = new Set<string>(Array.isArray(sec.fields) ? sec.fields : [])
    if (set.has(key)) set.delete(key)
    else set.add(key)
    updateSection(selectedIndex, { fields: Array.from(set) } as any)
  }

  const checked = (key: string) => (Array.isArray(sec.fields) ? sec.fields.includes(key) : false)

  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Business Data Editor</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }}>
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
        </div>
      </div>
    </div>
  )
}


