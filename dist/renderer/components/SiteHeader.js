import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SiteHeader(props) {
    const { logoUrl, businessName } = props;
    return (_jsx("header", { style: { padding: '12px 16px', borderBottom: '1px solid #eee' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [logoUrl ? (_jsx("img", { src: logoUrl, alt: businessName || 'Logo', style: { height: 32, width: 32, objectFit: 'contain' } })) : null, _jsx("strong", { children: businessName || '' })] }) }));
}
