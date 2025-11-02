import React from 'react'
import { useBuilder } from './context/BuilderProvider'
import { provisionSite, publishSite, getPublishStatus, getSiteSettings } from '../utils/api'

function isValidSlug(s: string) {
  return /^[a-z0-9-]{2,50}$/.test(s)
}

export default function BuilderShell() {
  const { businessId, slug, setSlug, lastSavedAt, platformData, draft } = useBuilder() as any
  const url = slug ? `https://${slug}.sites.afya.fit` : 'https://[slug].sites.afya.fit'
  const valid = !slug || isValidSlug(slug)
  const [status, setStatus] = React.useState<'not_provisioned' | 'provisioning' | 'provisioned' | 'publishing' | 'live' | 'error'>('not_provisioned')
  const [copied, setCopied] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [taskId, setTaskId] = React.useState<string | null>(null)
  const [slugReadOnly, setSlugReadOnly] = React.useState(false)
  // Load initial site settings on mount
  React.useEffect(() => {
    const loadSiteSettings = async () => {
      if (!businessId) return
      try {
        const res = await getSiteSettings(businessId)
        if (res.ok && res.data) {
          const { site_slug, provision_status } = res.data
          if (site_slug) {
            setSlug(site_slug)
            setSlugReadOnly(true)
          }
          if (provision_status) {
            setStatus(provision_status)
          }
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      }
    }
    loadSiteSettings()
  }, [businessId, setSlug])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const onProvisionOrPublish = async () => {
    if (!slug || !isValidSlug(slug)) return
    if (!draft) return
    
    setBusy(true)
    
    try {
      if (status === 'not_provisioned') {
        // Provision step
        setStatus('provisioning')
        const res = await provisionSite(businessId, { slug, apex_domain: 'sites.afya.fit' })
        if (res.ok) {
          setSlugReadOnly(true)
          setStatus('provisioned')
        } else {
          setStatus('error')
        }
      } else if (status === 'provisioned') {
        // Publish step
        setStatus('publishing')
        const res = await publishSite(businessId, { slug, draft })
        if (res.ok && res.data?.run_id) {
          setStatus('live')
        } else {
          setStatus('error')
        }
      }
    } catch (error) {
      console.error('Failed to provision/publish:', error)
      setStatus('error')
    } finally {
      setBusy(false)
    }
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
            onChange={e => !slugReadOnly && setSlug(e.target.value.toLowerCase())}
            placeholder='my-studio'
            readOnly={slugReadOnly}
            style={{ 
              marginLeft: 6, 
              padding: '6px 8px', 
              border: `1px solid ${valid ? 'var(--sb-color-border)' : '#d00'}`, 
              borderRadius: 6,
              backgroundColor: slugReadOnly ? '#f5f5f5' : '#fff',
              cursor: slugReadOnly ? 'not-allowed' : 'text'
            }}
          />
        </label>
        <span style={{ fontSize: 12, color: valid ? '#666' : '#d00' }}>{url}{!valid ? ' — use a‑z, 0‑9, hyphen' : ''}</span>
        <button onClick={copy} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)', display: 'inline-flex', alignItems: 'center', background: '#fff' }} title={copied ? 'Copied!' : 'Copy URL'} aria-label='Copy URL'>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="10" height="12" rx="2" fill={copied ? '#e6f6ec' : 'none'} stroke="#666" />
            <rect x="5" y="5" width="10" height="12" rx="2" fill="none" stroke="#666" />
          </svg>
        </button>
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: 999, 
          border: '1px solid var(--sb-color-border)', 
          fontSize: 12,
          backgroundColor: status === 'live' ? '#e6f6ec' : status === 'error' ? '#fee' : '#fff',
          color: status === 'live' ? '#0a5a2a' : status === 'error' ? '#c00' : '#666'
        }} title="Site status">
          {busy ? `${status}…` : status.replace('_', ' ')}
        </span>
        {/* Device and view toggles moved into PreviewPane */}
        <button
          onClick={onProvisionOrPublish}
          disabled={!slug || !valid || !draft || busy || (status !== 'not_provisioned' && status !== 'provisioned')}
          title={
            !slug ? 'Enter a slug first' : 
            !valid ? 'Invalid slug' : 
            status === 'not_provisioned' ? 'Provision infrastructure for this site' :
            status === 'provisioned' ? 'Publish content to live site' :
            'Site is being processed'
          }
          style={{ 
            padding: '6px 10px', 
            borderRadius: 6, 
            border: '1px solid var(--sb-color-border)', 
            opacity: (!slug || !valid || busy || (status !== 'not_provisioned' && status !== 'provisioned')) ? .6 : 1,
            backgroundColor: status === 'provisioned' ? '#e6f6ec' : '#fff'
          }}
        >
          {busy ? (
            status === 'provisioning' ? 'Provisioning…' : 
            status === 'publishing' ? 'Publishing…' : 
            'Processing…'
          ) : (
            status === 'not_provisioned' ? 'Provision' : 
            status === 'provisioned' ? 'Publish' : 
            'Publish'
          )}
        </button>
        
        <span style={{ fontSize: 12, color: '#666' }}>{lastSavedAt ? `Saved at ${lastSavedAt.toLocaleTimeString()}` : 'Autosaving…'}</span>
      </div>
    </div>
  )
}


