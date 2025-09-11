import React from 'react'
import { useBuilder } from './context/BuilderProvider'
import { publishSite, getPublishStatus } from '../shared/api'

function isValidSlug(s: string) {
  return /^[a-z0-9-]{2,50}$/.test(s)
}

export default function BuilderShell() {
  const { businessId, slug, setSlug, device, setDevice, view, setView, lastSavedAt, save, platformData, draft } = useBuilder() as any
  const url = slug ? `https://${slug}.sites.afya.fit` : 'https://[slug].sites.afya.fit'
  const valid = !slug || isValidSlug(slug)
  const [status, setStatus] = React.useState<'UNPROVISIONED' | 'PROVISIONING' | 'LIVE' | 'ERROR'>('UNPROVISIONED')
  const [copied, setCopied] = React.useState(false)
  const [publishing, setPublishing] = React.useState(false)
  const [taskId, setTaskId] = React.useState<string | null>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }
  const onPublish = async () => {
    if (!slug || !isValidSlug(slug)) return
    if (!draft) return
    setPublishing(true)
    setStatus('PROVISIONING')
    try {
      const res = await publishSite(businessId, { slug, draft })
      if (res.ok && res.data?.task_id) {
        setTaskId(res.data.task_id)
        pollStatus(res.data.task_id)
      } else {
        setStatus(res.ok ? 'LIVE' : 'ERROR')
      }
    } catch {
      setStatus('ERROR')
    } finally {
      setPublishing(false)
    }
  }

  const pollStatus = async (id: string) => {
    let attempts = 0
    const maxAttempts = 30
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
    while (attempts < maxAttempts) {
      const r = await getPublishStatus(id)
      if (r.ok) {
        const state = r.data?.state
        if (state === 'SUCCESS') { setStatus('LIVE'); setTaskId(null); return }
        if (state === 'FAILURE') { setStatus('ERROR'); setTaskId(null); return }
      }
      attempts += 1
      await delay(1000)
    }
    // timed out
    setStatus('ERROR')
    setTaskId(null)
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--sb-color-border)' }}>
      <strong>Site Builder</strong>
      <span style={{ opacity: .6 }}>{platformData?.business_info?.name || businessId}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', rowGap: 8 }}>
        <label title="Lowercase letters, numbers, hyphens; 2–50 chars">
          Slug:
          <input
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase())}
            placeholder='my-studio'
            style={{ marginLeft: 6, padding: '6px 8px', border: `1px solid ${valid ? 'var(--sb-color-border)' : '#d00'}`, borderRadius: 6 }}
          />
        </label>
        <span style={{ fontSize: 12, color: valid ? '#666' : '#d00' }}>{url}{!valid ? ' — use a‑z, 0‑9, hyphen' : ''}</span>
        <button onClick={copy} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)', display: 'inline-flex', alignItems: 'center', background: '#fff' }} title={copied ? 'Copied!' : 'Copy URL'} aria-label='Copy URL'>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="10" height="12" rx="2" fill={copied ? '#e6f6ec' : 'none'} stroke="#666" />
            <rect x="5" y="5" width="10" height="12" rx="2" fill="none" stroke="#666" />
          </svg>
        </button>
        <span style={{ padding: '4px 8px', borderRadius: 999, border: '1px solid var(--sb-color-border)', fontSize: 12 }} title="Publication status">
          {taskId ? `${status}…` : status}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => setDevice('desktop')} style={{ padding: '6px 10px', background: device==='desktop'?'#eee':'#fff', border: 'none' }}>Desktop</button>
            <button onClick={() => setDevice('mobile')} style={{ padding: '6px 10px', background: device==='mobile'?'#eee':'#fff', border: 'none', borderLeft: '1px solid var(--sb-color-border)' }}>Mobile</button>
          </div>
          <div style={{ display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => setView('draft')} style={{ padding: '6px 10px', background: view==='draft'?'#eee':'#fff', border: 'none' }}>Draft</button>
            <button onClick={() => setView('published')} style={{ padding: '6px 10px', background: view==='published'?'#eee':'#fff', border: 'none', borderLeft: '1px solid var(--sb-color-border)' }}>Published</button>
          </div>
        </div>
        <button onClick={save} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Save</button>
        <button
          onClick={onPublish}
          disabled={!slug || !valid || !draft || publishing}
          title={!slug ? 'Enter a slug first' : !valid ? 'Invalid slug' : undefined}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)', opacity: (!slug || !valid || publishing) ? .6 : 1 }}
        >
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
        <span style={{ fontSize: 12, color: '#666' }}>{lastSavedAt ? `Saved at ${lastSavedAt.toLocaleTimeString()}` : 'Not saved yet'}</span>
      </div>
    </div>
  )
}


