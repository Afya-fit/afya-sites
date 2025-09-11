"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpecialOffers;
const jsx_runtime_1 = require("react/jsx-runtime");
function SpecialOffers({ section }) {
    const { title, offers } = section;
    return ((0, jsx_runtime_1.jsx)("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: [title ? (0, jsx_runtime_1.jsx)("h2", { style: { marginTop: 0 }, children: title }) : null, (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }, children: offers.map(of => ((0, jsx_runtime_1.jsxs)("article", { style: { border: '1px solid #eee', borderRadius: 8, padding: 16 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0 }, children: of.title }), of.description ? (0, jsx_runtime_1.jsx)("p", { children: of.description }) : null, of.price ? (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: of.price }) }) : null, of.ctaHref && of.ctaLabel ? ((0, jsx_runtime_1.jsx)("a", { href: of.ctaHref, style: { color: '#1f6feb' }, children: of.ctaLabel })) : null] }, of.id))) })] }) }));
}
