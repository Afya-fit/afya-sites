import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeSections } from '../../renderer/sectionRegistry';
import { fetchPublicSiteData, saveSiteDraft } from '../../shared/api';
const BuilderContext = createContext(undefined);
export function useBuilder() {
    const ctx = useContext(BuilderContext);
    if (!ctx)
        throw new Error('useBuilder must be used within BuilderProvider');
    return ctx;
}
export function BuilderProvider({ businessId, children }) {
    const [slug, setSlug] = useState('');
    const [draft, setDraft] = useState(null);
    const [published, setPublished] = useState(null);
    const [platformData, setPlatformData] = useState(null);
    const [view, setView] = useState('draft');
    const [device, setDevice] = useState('desktop');
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [hydratedFromLocal, setHydratedFromLocal] = useState(false);
    const hydratedFromLocalRef = useRef(false);
    const [panelView, setPanelView] = useState('editor');
    const reload = useCallback(async () => {
        try {
            const json = await fetchPublicSiteData(businessId);
            const cfg = (json?.site_config || null);
            // Prefer local draft if present; only apply backend cfg when we didn't hydrate locally
            if (cfg && !hydratedFromLocalRef.current) {
                try {
                    const normalized = { ...cfg, sections: normalizeSections(cfg.sections) };
                    setDraft(normalized);
                }
                catch {
                    setDraft(cfg);
                }
            }
            if (json?.platform_data) {
                setPlatformData(json.platform_data);
            }
        }
        catch (_e) {
            // keep as-is on failure
        }
    }, [businessId]);
    useEffect(() => {
        // Try to hydrate from localStorage first
        try {
            const raw = localStorage.getItem(`sb:${businessId}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.slug)
                    setSlug(String(parsed.slug));
                if (parsed?.draft) {
                    setDraft(parsed.draft);
                    hydratedFromLocalRef.current = true;
                    setHydratedFromLocal(true);
                }
                else {
                    hydratedFromLocalRef.current = false;
                }
            }
            else {
                hydratedFromLocalRef.current = false;
            }
        }
        catch {
            hydratedFromLocalRef.current = false;
        }
        // Always load platform data and backend cfg (guarded by ref)
        reload();
    }, [businessId, reload]);
    // Autosave stub (localStorage) when draft/slug changes
    useEffect(() => {
        const t = setTimeout(() => {
            try {
                const payload = JSON.stringify({ slug, draft });
                localStorage.setItem(`sb:${businessId}`, payload);
                setLastSavedAt(new Date());
            }
            catch { }
        }, 600);
        return () => clearTimeout(t);
    }, [businessId, slug, draft]);
    const value = useMemo(() => ({
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
        addSection: (section) => {
            setDraft(prev => {
                if (!prev) {
                    return {
                        version: '1.0',
                        business_id: businessId,
                        theme: { mode: 'light', accent: 'clean' },
                        sections: [section],
                    };
                }
                return { ...prev, sections: [...prev.sections, section] };
            });
        },
        removeSection: (index) => {
            setDraft(prev => {
                if (!prev)
                    return prev;
                const next = [...prev.sections];
                if (index < 0 || index >= next.length)
                    return prev;
                next.splice(index, 1);
                return { ...prev, sections: next };
            });
        },
        lastSavedAt,
        selectedIndex,
        setSelectedIndex,
        updateSection: (index, patch) => {
            setDraft(prev => {
                if (!prev)
                    return prev;
                if (index < 0 || index >= prev.sections.length)
                    return prev;
                const next = [...prev.sections];
                next[index] = { ...next[index], ...patch };
                return { ...prev, sections: next };
            });
        },
        save: async () => {
            try {
                const payload = JSON.stringify({ slug, draft });
                localStorage.setItem(`sb:${businessId}`, payload);
                // fire-and-forget backend stub
                try {
                    await saveSiteDraft(businessId, { slug, draft });
                }
                catch { }
                setLastSavedAt(new Date());
            }
            catch { }
        },
        reorderSections: (next) => {
            setDraft(prev => {
                if (!prev)
                    return prev;
                return { ...prev, sections: next };
            });
        },
        panelView,
        setPanelView,
    }), [businessId, slug, draft, published, platformData, view, device, reload, lastSavedAt, selectedIndex, panelView]);
    return _jsx(BuilderContext.Provider, { value: value, children: children });
}
export default BuilderProvider;
