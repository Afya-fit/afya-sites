import React from 'react'
import { useBuilder } from './context/BuilderProvider'

type Props = { inline?: boolean }

export default function ImageSettingsPanel({ inline = false }: Props) {
  const { draft, selectedIndex, updateSection, openImageManager } = useBuilder() as any
  const [open, setOpen] = React.useState(inline ? true : false)
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
  const images: Array<{ key: string; url: string; label: string; ratio?: string; fit?: string }> = []
  if (isHero && heroSection.backgroundImageUrl) images.push({ key: 'hero-bg', url: heroSection.backgroundImageUrl, label: 'Background' })
  if (isHero && heroSection.contentImageUrl) images.push({ key: 'hero-content', url: heroSection.contentImageUrl, label: 'Content image', ratio: heroSection.contentImageRatio, fit: heroSection.contentImageFit })
  if (section?.type === 'content_block') {
    const media = (section as any).media || []
    media.forEach((m: any, i: number) => images.push({ key: `cb-${i}`, url: m?.url, label: `Image ${i + 1}`, ratio: m?.ratio, fit: m?.fit }))
  }

  const updateImageProp = (key: string, prop: string, value: string) => {
    if (key === 'hero-content') {
      if (prop === 'ratio') updateSection(selectedIndex, { contentImageRatio: value })
      else if (prop === 'fit') updateSection(selectedIndex, { contentImageFit: value })
    } else if (key.startsWith('cb-')) {
      const idx = parseInt(key.split('-')[1], 10)
      const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
      media[idx] = { ...(media[idx] || {}), [prop]: value }
      updateSection(selectedIndex, { media } as any)
    }
  }

  // Hide button when section has no way to add images (for now)
  if (section?.type !== 'hero' && section?.type !== 'content_block') return null

  const applyBulk = (patch: any) => {
    if (section?.type === 'content_block') {
      const media = ((section as any).media || []).map((m: any) => ({ ...m, ...patch }))
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
          <div key={im.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button 
              onClick={() => {
                // Open image library to change this image
                openImageManager({
                  onSelect: (url: string) => {
                    if (im.key === 'hero-bg') updateSection(selectedIndex, { backgroundImageUrl: url })
                    else if (im.key === 'hero-content') updateSection(selectedIndex, { contentImageUrl: url })
                    else if (im.key.startsWith('cb-')) {
                      const idx = parseInt(im.key.split('-')[1], 10)
                      const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                      media[idx] = { ...(media[idx] || {}), url }
                      updateSection(selectedIndex, { media } as any)
                    }
                  }
                })
              }} 
              style={{ border: '1px solid var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url || 'https://placehold.co/100x64/eee/ccc?text=?'} alt={im.label} style={{ width: '100%', height: 64, objectFit: 'cover', borderRadius: 4 }} />
              <div style={{ fontSize: 12, marginTop: 4 }}>{im.label}</div>
            </button>
            {/* Ratio & Fit controls (not for hero background) */}
            {im.key !== 'hero-bg' && (
              <div style={{ display: 'flex', gap: 4, fontSize: 11 }}>
                <select 
                  value={im.ratio || ''} 
                  onChange={e => updateImageProp(im.key, 'ratio', e.target.value)}
                  style={{ flex: 1, padding: '2px', borderRadius: 3, border: '1px solid #ddd', fontSize: 11 }}
                  title="Aspect ratio"
                >
                  <option value="">Ratio</option>
                  {['1x1', '4x3', '16x9', '3x4', '21x9', '5x3'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select 
                  value={im.fit || ''} 
                  onChange={e => updateImageProp(im.key, 'fit', e.target.value)}
                  style={{ flex: 1, padding: '2px', borderRadius: 3, border: '1px solid #ddd', fontSize: 11 }}
                  title="Object fit"
                >
                  <option value="">Fit</option>
                  {['cover', 'contain'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            )}
            <button 
              onClick={() => {
                if (im.key === 'hero-bg') updateSection(selectedIndex, { backgroundImageUrl: null })
                else if (im.key === 'hero-content') updateSection(selectedIndex, { contentImageUrl: null })
                else if (im.key.startsWith('cb-')) {
                  const idx = parseInt(im.key.split('-')[1], 10)
                  const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                  media.splice(idx, 1)
                  updateSection(selectedIndex, { media } as any)
                }
              }}
              style={{ padding: '2px 6px', fontSize: 11, borderRadius: 4, border: '1px solid #ddd', background: '#f5f5f5', color: '#666', cursor: 'pointer' }}
            >
              ✕ Remove
            </button>
          </div>
        ))}
        {section?.type === 'content_block' && images.length < 3 && (
          <button onClick={() => {
            // Open image library and add the selected image
            openImageManager({
              onSelect: (url: string) => {
                const media = Array.isArray((section as any).media) ? [ ...(section as any).media ] : []
                media.push({ url, alt: 'image' })
                updateSection(selectedIndex, { media } as any)
              }
            })
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


