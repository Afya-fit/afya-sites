"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BusinessDataEditor;
const jsx_runtime_1 = require("react/jsx-runtime");
const BuilderProvider_1 = require("../context/BuilderProvider");
function BusinessDataEditor() {
    const { draft, selectedIndex, updateSection } = (0, BuilderProvider_1.useBuilder)();
    if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'business_data')
        return null;
    const sec = draft.sections[selectedIndex];
    const toggleField = (key) => {
        const set = new Set(Array.isArray(sec.fields) ? sec.fields : []);
        if (set.has(key))
            set.delete(key);
        else
            set.add(key);
        updateSection(selectedIndex, { fields: Array.from(set) });
    };
    const checked = (key) => (Array.isArray(sec.fields) ? sec.fields.includes(key) : false);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Business Data Editor" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }, children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Title", (0, jsx_runtime_1.jsx)("input", { value: sec.title || '', onChange: e => updateSection(selectedIndex, { title: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 600, marginBottom: 6 }, children: "Include fields" }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: 'checkbox', checked: checked('business_info'), onChange: () => toggleField('business_info') }), " Business info"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: 'checkbox', checked: checked('programs'), onChange: () => toggleField('programs') }), " Programs"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: 'checkbox', checked: checked('products'), onChange: () => toggleField('products') }), " Products"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: 'checkbox', checked: checked('schedule'), onChange: () => toggleField('schedule') }), " Schedule"] }), (0, jsx_runtime_1.jsxs)("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [(0, jsx_runtime_1.jsx)("input", { type: 'checkbox', checked: checked('contact'), onChange: () => toggleField('contact') }), " Contact"] })] })] })] }));
}
