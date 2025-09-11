import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { SiteConfig, SectionUnion } from '@/sites/renderer/src/types'
import { normalizeSections } from '@/sites/renderer/src/sectionRegistry'
import { fetchPublicSiteData, saveSiteDraft } from '@/http/sites/siteConfig'

type BuilderView = 'draft' | 'published'
type BuilderDevice = 'desktop' | 'mobile'
type PanelView = 'editor' | 'media'

type BuilderContextValue = {
  businessId: string
  slug: string
  setSlug: (s: string) => void
  draft: SiteConfig | null
  published: SiteConfig | null
  platformData: Record<string, any> | null
  view: BuilderView
  setView: (v: BuilderView) => void
  device: BuilderDevice
  setDevice: (d: BuilderDevice) => void
  reload: () => Promise<void>
  addSection: (section: SectionUnion) => void
  removeSection: (index: number) => void
  lastSavedAt: Date | null
  selectedIndex: number | null
  setSelectedIndex: (i: number | null) => void
  updateSection: (index: number, patch: Partial<SectionUnion>) => void
  save: () => Promise<void>
  reorderSections: (next: SectionUnion[]) => void
  panelView: PanelView
  setPanelView: (v: PanelView) => void
}

const BuilderContext = createContext<BuilderContextValue | undefined>(undefined)

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}

type Props = { businessId: string; children: React.ReactNode }

export function BuilderProvider({ businessId, children }: Props) {
  const [slug, setSlug] = useState('')
  const [draft, setDraft] = useState<SiteConfig | null>(null)
  const [published, setPublished] = useState<SiteConfig | null>(null)
  const [platformData, setPlatformData] = useState<Record<string, any> | null>(null)
  const [view, setView] = useState<BuilderView>('draft')
  const [device, setDevice] = useState<BuilderDevice>('desktop')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hydratedFromLocal, setHydratedFromLocal] = useState<boolean>(false)
  const hydratedFromLocalRef = useRef<boolean>(false)
  const [panelView, setPanelView] = useState<PanelView>('editor')

  const reload = useCallback(async () => {
    try {
      const json = await fetchPublicSiteData(businessId)
      const cfg = (json?.site_config || null) as SiteConfig | null
      // Prefer local draft if present; only apply backend cfg when we didn't hydrate locally
      if (cfg && !hydratedFromLocalRef.current) {
        try {
          const normalized = { ...cfg, sections: normalizeSections(cfg.sections as any) }
          setDraft(normalized)
        } catch {
          setDraft(cfg)
        }
      }
      if (json?.platform_data) {
        setPlatformData(json.platform_data as any)
      }
    } catch (_e) {
      // keep as-is on failure
    }
  }, [businessId])

  useEffect(() => {
    // Try to hydrate from localStorage first
    try {
      const raw = localStorage.getItem(`sb:${businessId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.slug) setSlug(String(parsed.slug))
        if (parsed?.draft) {
          setDraft(parsed.draft as SiteConfig)
          hydratedFromLocalRef.current = true
          setHydratedFromLocal(true)
        } else {
          hydratedFromLocalRef.current = false
        }
      } else {
        hydratedFromLocalRef.current = false
      }
    } catch {
      hydratedFromLocalRef.current = false
    }
    // Always load platform data and backend cfg (guarded by ref)
    reload()
  }, [businessId, reload])

  // Autosave stub (localStorage) when draft/slug changes
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const payload = JSON.stringify({ slug, draft })
        localStorage.setItem(`sb:${businessId}`, payload)
        setLastSavedAt(new Date())
      } catch {}
    }, 600)
    return () => clearTimeout(t)
  }, [businessId, slug, draft])

  const value = useMemo<BuilderContextValue>(() => ({
    businessId,
    slug,
    setSlug,
    draft,
    published,
    platformData,
    view,
    setView,
    device,
    setDevice,
    reload,
    addSection: (section: SectionUnion) => {
      setDraft(prev => {
        if (!prev) {
          return {
            version: '1.0',
            business_id: businessId,
            theme: { mode: 'light', accent: 'clean' },
            sections: [section],
          }
        }
        return { ...prev, sections: [...prev.sections, section] }
      })
    },
    removeSection: (index: number) => {
      setDraft(prev => {
        if (!prev) return prev
        const next = [...prev.sections]
        if (index < 0 || index >= next.length) return prev
        next.splice(index, 1)
        return { ...prev, sections: next }
      })
    },
    lastSavedAt,
    selectedIndex,
    setSelectedIndex,
    updateSection: (index: number, patch: Partial<SectionUnion>) => {
      setDraft(prev => {
        if (!prev) return prev
        if (index < 0 || index >= prev.sections.length) return prev
        const next = [...prev.sections]
        next[index] = { ...(next[index] as any), ...(patch as any) }
        return { ...prev, sections: next }
      })
    },
    save: async () => {
      try {
        const payload = JSON.stringify({ slug, draft })
        localStorage.setItem(`sb:${businessId}`, payload)
        // fire-and-forget backend stub
        try { await saveSiteDraft(businessId, { slug, draft }) } catch {}
        setLastSavedAt(new Date())
      } catch {}
    },
    reorderSections: (next: SectionUnion[]) => {
      setDraft(prev => {
        if (!prev) return prev
        return { ...prev, sections: next }
      })
    },
    panelView,
    setPanelView,
  }), [businessId, slug, draft, published, platformData, view, device, reload, lastSavedAt, selectedIndex, panelView])

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
}

export default BuilderProvider


