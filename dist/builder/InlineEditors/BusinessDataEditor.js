import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBuilder } from '../context/BuilderProvider';
export default function BusinessDataEditor() {
    const { draft, selectedIndex, updateSection } = useBuilder();
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
    return (_jsxs("div", { style: { marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }, children: [_jsx("strong", { children: "Business Data Editor" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 8 }, children: [_jsxs("label", { children: ["Title", _jsx("input", { value: sec.title || '', onChange: e => updateSection(selectedIndex, { title: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, marginBottom: 6 }, children: "Include fields" }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [_jsx("input", { type: 'checkbox', checked: checked('business_info'), onChange: () => toggleField('business_info') }), " Business info"] }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [_jsx("input", { type: 'checkbox', checked: checked('programs'), onChange: () => toggleField('programs') }), " Programs"] }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [_jsx("input", { type: 'checkbox', checked: checked('products'), onChange: () => toggleField('products') }), " Products"] }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [_jsx("input", { type: 'checkbox', checked: checked('schedule'), onChange: () => toggleField('schedule') }), " Schedule"] }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }, children: [_jsx("input", { type: 'checkbox', checked: checked('contact'), onChange: () => toggleField('contact') }), " Contact"] })] })] })] }));
}
