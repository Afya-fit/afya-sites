import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SpecialOffers({ section }) {
    const { title, offers } = section;
    return (_jsx("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: _jsxs("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: [title ? _jsx("h2", { style: { marginTop: 0 }, children: title }) : null, _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }, children: offers.map(of => (_jsxs("article", { style: { border: '1px solid #eee', borderRadius: 8, padding: 16 }, children: [_jsx("h3", { style: { marginTop: 0 }, children: of.title }), of.description ? _jsx("p", { children: of.description }) : null, of.price ? _jsx("p", { children: _jsx("strong", { children: of.price }) }) : null, of.ctaHref && of.ctaLabel ? (_jsx("a", { href: of.ctaHref, style: { color: '#1f6feb' }, children: of.ctaLabel })) : null] }, of.id))) })] }) }));
}
