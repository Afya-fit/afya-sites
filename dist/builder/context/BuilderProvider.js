"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuilder = useBuilder;
exports.BuilderProvider = BuilderProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const sectionRegistry_1 = require("../../renderer/sectionRegistry");
const api_1 = require("../../shared/api");
const BuilderContext = (0, react_1.createContext)(undefined);
function useBuilder() {
    const ctx = (0, react_1.useContext)(BuilderContext);
    if (!ctx)
        throw new Error('useBuilder must be used within BuilderProvider');
    return ctx;
}
function BuilderProvider({ businessId, children }) {
    const [slug, setSlug] = (0, react_1.useState)('');
    const [draft, setDraft] = (0, react_1.useState)(null);
    const [published, setPublished] = (0, react_1.useState)(null);
    const [platformData, setPlatformData] = (0, react_1.useState)(null);
    const [view, setView] = (0, react_1.useState)('draft');
    const [device, setDevice] = (0, react_1.useState)('desktop');
    const [lastSavedAt, setLastSavedAt] = (0, react_1.useState)(null);
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(null);
    const [hydratedFromLocal, setHydratedFromLocal] = (0, react_1.useState)(false);
    const hydratedFromLocalRef = (0, react_1.useRef)(false);
    const [panelView, setPanelView] = (0, react_1.useState)('editor');
    const reload = (0, react_1.useCallback)(async () => {
        try {
            const json = await (0, api_1.fetchPublicSiteData)(businessId);
            const cfg = (json?.site_config || null);
            // Prefer local draft if present; only apply backend cfg when we didn't hydrate locally
            if (cfg && !hydratedFromLocalRef.current) {
                try {
                    const normalized = { ...cfg, sections: (0, sectionRegistry_1.normalizeSections)(cfg.sections) };
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
    const value = (0, react_1.useMemo)(() => ({
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
                    await (0, api_1.saveSiteDraft)(businessId, { slug, draft });
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
    return (0, jsx_runtime_1.jsx)(BuilderContext.Provider, { value: value, children: children });
}
exports.default = BuilderProvider;
