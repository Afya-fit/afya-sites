"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeroEditor;
const jsx_runtime_1 = require("react/jsx-runtime");
const BuilderProvider_1 = require("../context/BuilderProvider");
function HeroEditor() {
    const { draft, selectedIndex, updateSection, setPanelView } = (0, BuilderProvider_1.useBuilder)();
    if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'hero')
        return null;
    const hero = draft.sections[selectedIndex];
    const focal = hero.backgroundFocal?.desktop || { xPct: 50, yPct: 50 };
    const focalMobile = hero.backgroundFocal?.mobile || { xPct: focal.xPct, yPct: focal.yPct };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Hero Editor" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }, children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Title", (0, jsx_runtime_1.jsx)("input", { value: hero.title || '', onChange: e => updateSection(selectedIndex, { title: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["Subtitle", (0, jsx_runtime_1.jsx)("input", { value: hero.subtitle || '', onChange: e => updateSection(selectedIndex, { subtitle: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["Align", (0, jsx_runtime_1.jsxs)("select", { value: hero.align || 'center', onChange: e => updateSection(selectedIndex, { align: e.target.value }), children: [(0, jsx_runtime_1.jsx)("option", { value: 'left', children: "left" }), (0, jsx_runtime_1.jsx)("option", { value: 'center', children: "center" }), (0, jsx_runtime_1.jsx)("option", { value: 'right', children: "right" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["Valign", (0, jsx_runtime_1.jsxs)("select", { value: hero.valign || 'center', onChange: e => updateSection(selectedIndex, { valign: e.target.value }), children: [(0, jsx_runtime_1.jsx)("option", { value: 'top', children: "top" }), (0, jsx_runtime_1.jsx)("option", { value: 'center', children: "center" }), (0, jsx_runtime_1.jsx)("option", { value: 'bottom', children: "bottom" })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { gridColumn: '1 / -1' }, children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setPanelView('media'), style: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Configure media\u2026" }) })] })] }));
}
