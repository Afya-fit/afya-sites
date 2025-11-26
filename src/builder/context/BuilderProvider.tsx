import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { SiteConfig, SectionUnion } from '../../renderer/types'
import { normalizeSections } from '../../renderer/sectionRegistry'
import { fetchPublicSiteData, saveSiteDraft, loadSiteDraft } from '../../utils/api'

// Lazy import to avoid circular deps
const ImageLibrary = React.lazy(() => import('../ImageLibrary'))

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
  openImageManager: (opts?: { mode?: 'manage' | 'picker'; folder?: string; onSelect?: (_url: string) => void }) => void
  closeImageManager: () => void
  imageManagerOnSelect: ((_url: string) => void) | null
  updateTheme: (patch: Record<string, any>) => void
  updateDraft: (patch: Partial<SiteConfig>) => void
  
  // NEW: Preview Mode State
  previewingVersionId: string | null
  previewingConfig: SiteConfig | null
  isPreviewMode: boolean
  startPreview: (versionId: string) => Promise<void>
  exitPreview: () => void
  restoreVersion: (versionId?: string) => Promise<void>
}

const BuilderContext = createContext<BuilderContextValue | undefined>(undefined)

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}

type Props = { businessId: string; children: React.ReactNode }

/**
 * Default Theme Configuration (v1.0)
 * 
 * This is the baseline theme configuration used when no theme is specified.
 * All theme properties are explicitly defined to ensure consistent behavior.
 * 
 * See docs/THEME_VERSIONING.md for complete theme documentation.
 */
const DEFAULT_THEME = {
  theme_version: '1.1',
  mode: 'light' as const,
  accent: 'blue' as const,
  typography: {
    preset: 'modern' as const,
    displayScale: 'standard' as const,
    textScale: 'standard' as const,
    adaptiveTitles: true,
    // Keep legacy for backward compatibility

  }
}

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
  const skipNextAutosaveRef = useRef<boolean>(false)
  const [panelView, setPanelView] = useState<PanelView>('editor')
  const [imageManagerOpen, setImageManagerOpen] = useState<boolean>(false)
  const [imageManagerMode, setImageManagerMode] = useState<'manage' | 'picker'>('manage')
  const [imageManagerFolder, setImageManagerFolder] = useState<string>('gallery')
  const imagePickerCallbackRef = useRef<null | ((url: string) => void)>(null)

  // NEW: Preview Mode State
  const [previewingVersionId, setPreviewingVersionId] = useState<string | null>(null)
  const [previewingConfig, setPreviewingConfig] = useState<SiteConfig | null>(null)
  const isPreviewMode = previewingVersionId !== null

  const reload = useCallback(async () => {
    if (!businessId) return
    try {
      // Load draft from the same endpoint we save to
      const draftResponse = await loadSiteDraft(businessId)
      if (draftResponse.ok && draftResponse.data) {
        // Check if this is a fresh revert by looking for a localStorage flag
        const revertFlag = localStorage.getItem(`sb:revert:${businessId}`)
        if (revertFlag) {
          skipNextAutosaveRef.current = true
          localStorage.removeItem(`sb:revert:${businessId}`) // Clear the flag
        }

        // Load draft data
        // Force backend loading if we have a revert flag (overrides localStorage)
        const shouldLoadFromBackend = !hydratedFromLocalRef.current || revertFlag
        if (draftResponse.data.draft && shouldLoadFromBackend) {
          const cfg = draftResponse.data.draft as SiteConfig
          // Only apply backend config if it has sections
          if (cfg && cfg.sections && cfg.sections.length > 0) {
            try {
              const normalized = { ...cfg, sections: normalizeSections(cfg.sections as any) }
              setDraft(normalized)
              
              // If this was a revert, also clear localStorage to match backend
              if (revertFlag) {
                const payload = JSON.stringify({ slug: draftResponse.data.slug || '', draft: normalized })
                localStorage.setItem(`sb:${businessId}`, payload)
              }
            } catch {
              setDraft(cfg)
            }
          }
        }
        
        // Load published data
        if (draftResponse.data.published) {
          const publishedCfg = draftResponse.data.published as SiteConfig
          try {
            const normalized = { ...publishedCfg, sections: normalizeSections(publishedCfg.sections as any) }
            setPublished(normalized)
          } catch {
            setPublished(publishedCfg)
          }
        } else {
          setPublished(null)
        }
      }
      
      // Still load platform data from the public endpoint
      try {
        const json = await fetchPublicSiteData(businessId)
        if (json?.platform_data) {
          setPlatformData(json.platform_data as any)
        }
      } catch {
        // ignore platform data errors
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

  // Autosave (localStorage + backend) when draft/slug changes
  useEffect(() => {
    // Skip autosave if we're in a post-revert state
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false
      return
    }

    const t = setTimeout(async () => {
      try {
        // 1. Always save to localStorage first (fast, reliable)
        const payload = JSON.stringify({ slug, draft })
        localStorage.setItem(`sb:${businessId}`, payload)
        setLastSavedAt(new Date())
        
        // 2. Also save to backend (with bulletproof error handling)
        try {
          const result = await saveSiteDraft(businessId, { slug, draft })
          if (result.ok) {
            console.log('✅ Draft auto-saved to backend')
          } else {
            console.warn('⚠️ Backend autosave failed, localStorage saved')
          }
        } catch (backendError) {
          console.warn('⚠️ Backend autosave error:', backendError)
          // localStorage already saved, so user doesn't lose data
        }
      } catch (localError) {
        console.error('❌ Critical: localStorage autosave failed:', localError)
      }
    }, 2000) // 2 seconds debounce to avoid rate limiting during typing
    return () => clearTimeout(t)
  }, [businessId, slug, draft])

  // NEW: Preview Mode Functions
  const startPreview = useCallback(async (versionId: string) => {
    try {
      console.log('👁️ Starting preview for version:', versionId)
      
      // Fetch the version content using the new backend endpoint
      const response = await fetch(`/api/sitebuilder/${businessId}/versions`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          action: 'get_content',
          version_id: versionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch version content: ${response.status}`)
      }

      const data = await response.json()
      if (!data.ok) {
        throw new Error('Failed to load version content')
      }

      console.log('📦 Loaded version content:', data.data)
      
      // Set preview state with the actual version content
      setPreviewingVersionId(versionId)
      
      // Normalize the version content sections
      try {
        const versionConfig = data.data as SiteConfig
        if (versionConfig && versionConfig.sections) {
          const normalized = { ...versionConfig, sections: normalizeSections(versionConfig.sections as any) }
          setPreviewingConfig(normalized)
        } else {
          setPreviewingConfig(versionConfig)
        }
      } catch (normalizeError) {
        console.warn('⚠️ Failed to normalize version sections, using raw config:', normalizeError)
        setPreviewingConfig(data.data)
      }
      
      console.log('✅ Preview mode activated with content')
    } catch (error) {
      console.error('❌ Failed to start preview:', error)
      alert(`Failed to preview version: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [businessId])

  const exitPreview = useCallback(() => {
    setPreviewingVersionId(null)
    setPreviewingConfig(null)
  }, [])

  const restoreVersion = useCallback(async (versionId?: string) => {
    const targetVersionId = versionId || previewingVersionId
    if (!targetVersionId) {
      console.error('No version to restore')
      return
    }

    try {
      // Call the existing revert endpoint
      const response = await fetch(`/api/sitebuilder/${businessId}/versions`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          action: 'revert',
          version_id: targetVersionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Restore failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.ok) {
        throw new Error(data.message || 'Restore failed')
      }

      // Set revert flag to prevent autosave from overwriting
      localStorage.setItem(`sb:revert:${businessId}`, 'true');

      // Exit preview mode
      exitPreview()
      
      // Reload to get the restored content (no page refresh!)
      await reload()
    } catch (error) {
      console.error('❌ Failed to restore version:', error)
      alert(`Failed to restore version: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [businessId, previewingVersionId, exitPreview, reload])

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
    lastSavedAt,
    selectedIndex,
    setSelectedIndex,
    panelView,
    setPanelView,
    updateSection: (index: number, patch: Partial<SectionUnion>) => {
      setDraft(prev => {
        if (!prev?.sections) return prev
        const next = [...prev.sections]
        next[index] = { ...next[index], ...patch } as SectionUnion
        return { ...prev, sections: next }
      })
    },
    addSection: (section: SectionUnion) => {
      setDraft(prev => {
        if (!prev) return { theme: DEFAULT_THEME, sections: [section], version: '1.0' } as SiteConfig
        const next = [...(prev.sections || []), section]
        return { ...prev, sections: next }
      })
    },
    removeSection: (index: number) => {
      setDraft(prev => {
        if (!prev?.sections) return prev
        const next = [...prev.sections]
        next.splice(index, 1)
        return { ...prev, sections: next }
      })
    },
    updateTheme: (patch: Record<string, any>) => {
      setDraft(prev => {
        if (!prev) return prev
        return { ...prev, theme: { ...prev.theme, ...patch } }
      })
    },
    updateDraft: (patch: Partial<SiteConfig>) => {
      setDraft(prev => {
        if (!prev) return patch as SiteConfig
        // Special handling for sections to preserve valid structure
        if (patch.sections) {
          try {
            const sections = normalizeSections(patch.sections as any)
            return { ...prev, ...patch, sections }
          } catch {
            // If normalization fails, use the patch as-is
            return { ...prev, ...patch }
          }
        }
        return { ...prev, ...patch }
      })
    },
    save: async () => {
      try {
        const result = await saveSiteDraft(businessId, { slug, draft })
        if (result.ok) {
          setLastSavedAt(new Date())
        } else {
          throw new Error('Save failed')
        }
      } catch {}
    },
    reorderSections: (next: SectionUnion[]) => {
      setDraft(prev => {
        if (!prev) return prev
        return { ...prev, sections: next }
      })
    },
    openImageManager: (opts = {}) => {
      setImageManagerMode(opts.mode || 'manage')
      setImageManagerFolder(opts.folder || 'gallery')
      imagePickerCallbackRef.current = opts.onSelect || null
      setImageManagerOpen(true)
    },
    closeImageManager: () => {
      setImageManagerOpen(false)
      imagePickerCallbackRef.current = null
    },
    imageManagerOnSelect: imagePickerCallbackRef.current,
    
    // NEW: Preview Mode Interface
    previewingVersionId,
    previewingConfig,
    isPreviewMode,
    startPreview,
    exitPreview,
    restoreVersion,
  }), [businessId, slug, draft, published, platformData, view, device, reload, lastSavedAt, selectedIndex, panelView, previewingVersionId, previewingConfig, isPreviewMode, startPreview, exitPreview, restoreVersion])

  return (
    <BuilderContext.Provider value={value}>
      {children}
      {imageManagerOpen && (
        // Render the global Image Library modal at the provider level so it overlays the builder
        <React.Suspense fallback={null}>
          {/* Lazy import to avoid circular deps and reduce initial cost */}
          <ImageLibrary
            businessId={businessId}
            onClose={() => setImageManagerOpen(false)}
            onSelect={(url: string) => {
              const cb = imagePickerCallbackRef.current
              if (cb) {
                try { cb(url) } catch {}
              }
              setImageManagerOpen(false)
              imagePickerCallbackRef.current = null
            }}
            folder={imageManagerFolder}
          />
        </React.Suspense>
      )}
    </BuilderContext.Provider>
  )
}

export default BuilderProvider