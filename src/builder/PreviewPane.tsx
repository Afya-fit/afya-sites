import React, { useEffect, useMemo } from 'react'
import Head from 'next/head'
import { useBuilder } from './context/BuilderProvider'
import SectionRenderer from '@/sites/renderer/src/SectionRenderer'
import BrandThemeProvider from '@/sites/renderer/src/theme/BrandThemeProvider'
import { shouldRender } from '@/sites/renderer/src/sectionRegistry'

export default function PreviewPane() {
  const { draft, published, view, device, selectedIndex, platformData } = useBuilder()
  const active = useMemo(() => (view === 'draft' ? draft : published || draft), [view, draft, published])
  useEffect(() => {
    if (selectedIndex == null) return
    const el = document.querySelector(`[data-sb-section-index="${selectedIndex}"]`)
    if (el && 'scrollIntoView' in el) {
      ;(el as any).scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedIndex])
  const visibleIndices = useMemo(() => {
    const arr: number[] = []
    const sections = active?.sections || []
    if (selectedIndex != null && sections[selectedIndex]?.type === 'links_page') {
      // When Links is selected, hide everything else
      return [selectedIndex]
    }
    sections.forEach((s, idx) => {
      if (shouldRender(s as any, idx, { selectedIndex, isPreview: true })) arr.push(idx)
    })
    return arr
  }, [active, selectedIndex])
  if (!active) return <div style={{ padding: 16, opacity: .6 }}>Loading…</div>
  return (
    <div
      className='site-preview'
      style={{
        background: 'var(--sb-color-surface)',
        width: device === 'mobile' ? 375 : '100%',
        marginInline: device === 'mobile' ? 'auto' : undefined,
        borderRadius: device === 'mobile' ? 24 : 4,
        boxShadow: device === 'mobile' ? '0 0 0 12px #f7f7f8, 0 2px 20px rgba(0,0,0,.1)' : undefined,
        border: '1px solid var(--sb-color-border)',
        height: 'calc(100vh - 220px)',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 0,
      }}
    >
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; connect-src 'self' https: ws: wss:; frame-ancestors 'self'"
        />
      </Head>
      <BrandThemeProvider config={active}>
        {active.sections && active.sections.length > 0 ? (
          <SectionRenderer
            sections={active.sections as any}
            data={{ site_config: active, platform_data: platformData || {}, __preview_device: device, __visible_indices: visibleIndices }}
          />
        ) : (
          <div style={{ padding: 24, color: 'var(--sb-color-text)' }}>
            <strong>No sections yet.</strong>
            <div style={{ marginTop: 8, opacity: .8 }}>Use the Sections panel to add your first section.</div>
          </div>
        )}
      </BrandThemeProvider>
    </div>
  )
}


