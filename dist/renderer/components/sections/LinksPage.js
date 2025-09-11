import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LinksPage({ section }) {
    const { title, links } = section;
    return (_jsx("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: _jsxs("div", { style: { maxWidth: 680, margin: '0 auto', textAlign: 'center' }, children: [title ? _jsx("h2", { style: { marginTop: 0 }, children: title }) : null, _jsx("div", { style: { display: 'grid', gap: 12 }, children: links.map(link => (_jsx("a", { href: link.href, style: { display: 'block', padding: '12px 16px', border: '1px solid #eee', borderRadius: 8 }, children: link.label }, link.id))) })] }) }));
}
