"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreviewPane;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BuilderProvider_1 = require("./context/BuilderProvider");
const SectionRenderer_1 = __importDefault(require("../renderer/SectionRenderer"));
const BrandThemeProvider_1 = __importDefault(require("../renderer/theme/BrandThemeProvider"));
const sectionRegistry_1 = require("../renderer/sectionRegistry");
function PreviewPane() {
    const { draft, published, view, device, selectedIndex, platformData } = (0, BuilderProvider_1.useBuilder)();
    const active = (0, react_1.useMemo)(() => (view === 'draft' ? draft : published || draft), [view, draft, published]);
    (0, react_1.useEffect)(() => {
        if (selectedIndex == null)
            return;
        const el = document.querySelector(`[data-sb-section-index="${selectedIndex}"]`);
        if (el && 'scrollIntoView' in el) {
            ;
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedIndex]);
    const visibleIndices = (0, react_1.useMemo)(() => {
        const arr = [];
        const sections = active?.sections || [];
        if (selectedIndex != null && sections[selectedIndex]?.type === 'links_page') {
            // When Links is selected, hide everything else
            return [selectedIndex];
        }
        sections.forEach((s, idx) => {
            if ((0, sectionRegistry_1.shouldRender)(s, idx, { selectedIndex, isPreview: true }))
                arr.push(idx);
        });
        return arr;
    }, [active, selectedIndex]);
    if (!active)
        return (0, jsx_runtime_1.jsx)("div", { style: { padding: 16, opacity: .6 }, children: "Loading\u2026" });
    return ((0, jsx_runtime_1.jsx)("div", { className: 'site-preview', style: {
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
        }, children: (0, jsx_runtime_1.jsx)(BrandThemeProvider_1.default, { config: active, children: active.sections && active.sections.length > 0 ? ((0, jsx_runtime_1.jsx)(SectionRenderer_1.default, { sections: active.sections, data: { site_config: active, platform_data: platformData || {}, __preview_device: device, __visible_indices: visibleIndices } })) : ((0, jsx_runtime_1.jsxs)("div", { style: { padding: 24, color: 'var(--sb-color-text)' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "No sections yet." }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 8, opacity: .8 }, children: "Use the Sections panel to add your first section." })] })) }) }));
}
