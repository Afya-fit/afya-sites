import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBuilder } from '../context/BuilderProvider';
export default function LinksPageEditor() {
    const { draft, selectedIndex, updateSection } = useBuilder();
    if (selectedIndex == null || !draft || draft.sections[selectedIndex]?.type !== 'links_page')
        return null;
    const page = draft.sections[selectedIndex];
    const links = Array.isArray(page.links) ? page.links : [];
    const setLinks = (next) => updateSection(selectedIndex, { links: next });
    const addLink = () => {
        const id = Math.random().toString(36).slice(2, 8);
        setLinks([...(links || []), { id, label: 'New link', href: '#' }]);
    };
    const removeLink = (idx) => {
        const next = [...links];
        next.splice(idx, 1);
        setLinks(next);
    };
    return (_jsxs("div", { style: { marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }, children: [_jsx("strong", { children: "Links Page Editor" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }, children: [_jsxs("label", { style: { gridColumn: '1 / -1' }, children: ["Title", _jsx("input", { value: page.title || '', onChange: e => updateSection(selectedIndex, { title: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), _jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("span", { style: { fontWeight: 600 }, children: "Links" }), _jsx("button", { onClick: addLink, style: { marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Link" })] }), _jsx("div", { style: { marginTop: 8, display: 'grid', gap: 8 }, children: links.map((link, idx) => (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }, children: [_jsx("input", { value: link.label, onChange: e => {
                                                const next = [...links];
                                                next[idx] = { ...next[idx], label: e.target.value };
                                                setLinks(next);
                                            }, placeholder: 'Label', style: { padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } }), _jsx("input", { value: link.href, onChange: e => {
                                                const next = [...links];
                                                next[idx] = { ...next[idx], href: e.target.value };
                                                setLinks(next);
                                            }, placeholder: 'https://\u2026', style: { padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } }), _jsx("button", { onClick: () => removeLink(idx), style: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Remove" })] }, link.id))) })] })] })] }));
}
