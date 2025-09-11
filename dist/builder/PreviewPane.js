import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useBuilder } from './context/BuilderProvider';
import SectionRenderer from '../renderer/SectionRenderer';
import BrandThemeProvider from '../renderer/theme/BrandThemeProvider';
import { shouldRender } from '../renderer/sectionRegistry';
export default function PreviewPane() {
    const { draft, published, view, device, selectedIndex, platformData } = useBuilder();
    const active = useMemo(() => (view === 'draft' ? draft : published || draft), [view, draft, published]);
    useEffect(() => {
        if (selectedIndex == null)
            return;
        const el = document.querySelector(`[data-sb-section-index="${selectedIndex}"]`);
        if (el && 'scrollIntoView' in el) {
            ;
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedIndex]);
    const visibleIndices = useMemo(() => {
        const arr = [];
        const sections = active?.sections || [];
        if (selectedIndex != null && sections[selectedIndex]?.type === 'links_page') {
            // When Links is selected, hide everything else
            return [selectedIndex];
        }
        sections.forEach((s, idx) => {
            if (shouldRender(s, idx, { selectedIndex, isPreview: true }))
                arr.push(idx);
        });
        return arr;
    }, [active, selectedIndex]);
    if (!active)
        return _jsx("div", { style: { padding: 16, opacity: .6 }, children: "Loading\u2026" });
    return (_jsxs("div", { className: 'site-preview', style: {
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
        }, children: [_jsx(Head, { children: _jsx("meta", { httpEquiv: "Content-Security-Policy", content: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; connect-src 'self' https: ws: wss:; frame-ancestors 'self'" }) }), _jsx(BrandThemeProvider, { config: active, children: active.sections && active.sections.length > 0 ? (_jsx(SectionRenderer, { sections: active.sections, data: { site_config: active, platform_data: platformData || {}, __preview_device: device, __visible_indices: visibleIndices } })) : (_jsxs("div", { style: { padding: 24, color: 'var(--sb-color-text)' }, children: [_jsx("strong", { children: "No sections yet." }), _jsx("div", { style: { marginTop: 8, opacity: .8 }, children: "Use the Sections panel to add your first section." })] })) })] }));
}
