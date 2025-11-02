import React from 'react'
import { useBuilder } from './context/BuilderProvider'

type Props = { inline?: boolean }

export default function ImageSettingsPanel({ inline = false }: Props) {
  const { draft, selectedIndex, updateSection, device, openImageManager } = useBuilder() as any
  const [open, setOpen] = React.useState(inline ? true : false)
  const [activeIdx, setActiveIdx] = React.useState<number>(0)
  React.useEffect(() => {
    if (inline) return
    const onOpen = () => setOpen(true)
    window.addEventListener('sb:open-media-settings', onOpen as any)
    return () => window.removeEventListener('sb:open-media-settings', onOpen as any)
  }, [inline])
  if (!draft || selectedIndex == null) return null
  const section = draft.sections[selectedIndex]
  const isHero = section?.type === 'hero'
  const heroSection = isHero ? (section as any) : null
  const images: Array<{ key: string; url: string; label: string }> = []
  if (isHero && heroSection.backgroundImageUrl) images.push({ key: 'hero-bg', url: heroSection.backgroundImageUrl, label: 'Background' })
  if (isHero && heroSection.contentImageUrl) images.push({ key: 'hero-content', url: heroSection.contentImageUrl, label: 'Content image' })
  if (section?.type === 'content_block') {
    const media = (section as any).media || []
    media.forEach((m: any, i: number) => images.push({ key: `cb-${i}`, url: m?.url, label: `Image ${i + 1}` }))
  }

  // Hide button when section has no way to add images (for now)
  if (section?.type !== 'hero' && section?.type !== 'content_block') return null


  const active = images[activeIdx]

  const applyBulk = (patch: any) => {
    if (section?.type === 'content_block') {
      const media = ((section as any).media || []).map((m: any) => ({ ...m, ...patch }))
      updateSection(selectedIndex, { media } as any)
    }
  }

  const applyPerImage = (patch: any) => {
    if (active.key === 'hero-bg') {
      updateSection(selectedIndex, patch)
    } else if (active.key === 'hero-content') {
      updateSection(selectedIndex, patch)
    } else if (active.key.startsWith('cb-')) {
      const idx = parseInt(active.key.split('-')[1], 10)
      const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
      media[idx] = { ...(media[idx] || {}), ...patch }
      updateSection(selectedIndex, { media } as any)
    }
  }

  const body = (
    <div style={{ marginTop: inline ? 8 : 12, display: 'grid', gap: 12 }}>
      {section?.type === 'content_block' && (
        <div>
          <div style={{ fontWeight: 600 }}>Defaults for this section</div>
          <label>Figure size (desktop)
            <select value={(section as any).figureSize || 'L'} onChange={e => updateSection(selectedIndex, { figureSize: e.target.value })}>
              {['S','M','L'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ marginLeft: 12 }}>Default fit
            <select onChange={e => applyBulk({ fit: e.target.value })}>
              <option value=''>no change</option>
              {['cover','contain'].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        </div>
      )}
      <div style={{ fontWeight: 600 }}>Section images</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {images.map((im, i) => (
          <button key={im.key} onClick={() => setActiveIdx(i)} style={{ border: i===activeIdx?'2px solid #111':'1px solid var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.url || 'https://placehold.co/100x64/eee/ccc?text=?'} alt={im.label} style={{ width: '100%', height: 64, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ fontSize: 12, marginTop: 4 }}>{im.label}</div>
          </button>
        ))}
        {section?.type === 'content_block' && images.length < 3 && (
          <button onClick={() => {
            const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
            media.push({ url: '', alt: 'image' })
            updateSection(selectedIndex, { media } as any)
            setActiveIdx(images.length)
          }} style={{ border: '1px dashed var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }}>
            + Add image
          </button>
        )}
        {isHero && !heroSection.backgroundImageUrl && (
          <button 
            onClick={() => openImageManager({ onSelect: (url: string) => updateSection(selectedIndex, { backgroundImageUrl: url }) })}
            style={{ border: '1px dashed var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }}
          >
            + Set background
          </button>
        )}
        {isHero && !heroSection.contentImageUrl && (
          <button 
            onClick={() => openImageManager({ onSelect: (url: string) => updateSection(selectedIndex, { contentImageUrl: url }) })}
            style={{ border: '1px dashed var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }}
          >
            + Add content image
          </button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600 }}>Selected image</div>
        {active && (
          <div style={{ display: 'grid', gap: 8 }}>
            <label>Image URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={active.url || ''}
                onChange={e => {
                  const url = e.target.value
                  if (active.key === 'hero-bg') updateSection(selectedIndex, { backgroundImageUrl: url })
                  else if (active.key === 'hero-content') updateSection(selectedIndex, { contentImageUrl: url })
                  else if (active.key.startsWith('cb-')) {
                    const idx = parseInt(active.key.split('-')[1], 10)
                    const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                    media[idx] = { ...(media[idx] || {}), url }
                    updateSection(selectedIndex, { media } as any)
                  }
                }}
                style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
              />
              <button onClick={() => {
                const onSelect = (url: string) => {
                  if (active.key === 'hero-bg') updateSection(selectedIndex, { backgroundImageUrl: url })
                  else if (active.key === 'hero-content') updateSection(selectedIndex, { contentImageUrl: url })
                  else if (active.key.startsWith('cb-')) {
                    const idx = parseInt(active.key.split('-')[1], 10)
                    const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                    media[idx] = { ...(media[idx] || {}), url }
                    updateSection(selectedIndex, { media } as any)
                  }
                }
                openImageManager({ onSelect })
              }}>Change</button>
            </div>
            {active.key === 'hero-content' && (
              <label>Alt text
                <input
                  value={(section as any).contentImageAlt || ''}
                  onChange={e => updateSection(selectedIndex, { contentImageAlt: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
                />
              </label>
            )}
            {(active.key === 'hero-content' || active.key.startsWith('cb-')) && (
              <label>Ratio
                <select onChange={e => applyPerImage(active.key === 'hero-content' ? { contentImageRatio: e.target.value } : {})}>
                  {['1x1','4x3','16x9','3x4','21x9','5x3'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            )}
            {(active.key === 'hero-content' || active.key.startsWith('cb-')) && (
              <label>Fit
                <select onChange={e => applyPerImage(active.key === 'hero-content' ? { contentImageFit: e.target.value } : {})}>
                  {['cover','contain'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
            )}
            {active.key === 'hero-bg' && (
              <label>Background size
                <select value={(section as any).backgroundSize || 'cover'} onChange={e => updateSection(selectedIndex, { backgroundSize: e.target.value })}>
                  {['cover','contain'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
            )}
            {active.key.startsWith('cb-') && (
              <button onClick={() => {
                const idx = parseInt(active.key.split('-')[1], 10)
                const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                media.splice(idx, 1)
                updateSection(selectedIndex, { media } as any)
                setActiveIdx(0)
              }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Remove image</button>
            )}
            {active.key === 'hero-content' && (
              <label>Size (desktop)
                <select value={(section as any).contentImageSize || 'M'} onChange={e => updateSection(selectedIndex, { contentImageSize: e.target.value })}>
                  {['XS','S','M','L'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
            {active.key === 'hero-bg' && (
              <div>
                <div style={{ marginBottom: 6 }}>Focal ({device})</div>
                <div
                  style={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '16 / 9', background: `url(${active.url}) center/cover no-repeat`, border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
                  onClick={e => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
                    const key = device === 'mobile' ? 'mobile' : 'desktop'
                    const next = { backgroundFocal: { ...((section as any).backgroundFocal || {}), [key]: { xPct, yPct } } }
                    updateSection(selectedIndex, next)
                  }}
                />
                <div style={{ marginTop: 12 }}>
                  <label>Image overlay
                    <select 
                      value={(section as any).imageOverlay?.type || 'none'} 
                      onChange={e => updateSection(selectedIndex, { 
                        imageOverlay: e.target.value === 'none' ? null : { type: e.target.value as any }
                      })}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}
                    >
                      <option value='none'>None</option>
                      <option value='dark'>Dark</option>
                      <option value='light'>Light</option>
                      <option value='brand'>Brand</option>
                      <option value='gradient'>Gradient</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (inline) {
    return (
      <div>{body}</div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}
      >
        Configure media
      </button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', gridTemplateColumns: '360px 1fr', background: 'rgba(0,0,0,.04)', zIndex: 10 }}>
          <div style={{ background: '#fff', borderRight: '1px solid var(--sb-color-border)', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Image settings</strong>
              <button onClick={() => setOpen(false)} style={{ padding: '4px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}>Close</button>
            </div>
            {body}
          </div>
          <div onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}


