import React from 'react'
import { useBuilder } from '../context/BuilderProvider'

export default function ScheduleEditor() {
  const { draft, selectedIndex, updateSection } = useBuilder() as any
  if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'schedule') return null
  const sec = draft.sections[selectedIndex] as any

  const setWindowDays = (days: number) => updateSection(selectedIndex, { windowDays: days } as any)
  const setViewMode = (mode: 'stacked' | 'single_day') => updateSection(selectedIndex, { viewMode: mode } as any)

  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }}>
      <strong>Schedule Editor</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }}>
        <label>Section slug (anchor)
          <input
            value={sec.slug || ''}
            onChange={e => {
              const raw = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
              ;(e.target as HTMLInputElement).value = raw
              updateSection(selectedIndex, { slug: raw })
            }}
            placeholder="e.g. schedule"
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
          <div style={{ fontWeight: 600, marginBottom: 6 }}>View</div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='radio' name='sb-schedule-view' checked={(sec.viewMode || 'stacked') === 'stacked'} onChange={() => setViewMode('stacked')} /> Stacked (7-day)
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='radio' name='sb-schedule-view' checked={(sec.viewMode || 'stacked') === 'single_day'} onChange={() => setViewMode('single_day')} /> Single day
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Window</div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='radio' name='sb-schedule-window' checked={(sec.windowDays ?? 7) === 7} onChange={() => setWindowDays(7)} /> 7 days
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <input type='radio' name='sb-schedule-window' checked={(sec.windowDays ?? 7) === 3} onChange={() => setWindowDays(3)} /> 72 hours
          </label>
        </div>
      </div>
    </div>
  )
}


