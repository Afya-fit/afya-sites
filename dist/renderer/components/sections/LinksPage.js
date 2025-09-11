"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinksPage;
const jsx_runtime_1 = require("react/jsx-runtime");
function LinksPage({ section }) {
    const { title, links } = section;
    return ((0, jsx_runtime_1.jsx)("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 680, margin: '0 auto', textAlign: 'center' }, children: [title ? (0, jsx_runtime_1.jsx)("h2", { style: { marginTop: 0 }, children: title }) : null, (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gap: 12 }, children: links.map(link => ((0, jsx_runtime_1.jsx)("a", { href: link.href, style: { display: 'block', padding: '12px 16px', border: '1px solid #eee', borderRadius: 8 }, children: link.label }, link.id))) })] }) }));
}
