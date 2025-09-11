"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SiteHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
function SiteHeader(props) {
    const { logoUrl, businessName } = props;
    return ((0, jsx_runtime_1.jsx)("header", { style: { padding: '12px 16px', borderBottom: '1px solid #eee' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [logoUrl ? ((0, jsx_runtime_1.jsx)("img", { src: logoUrl, alt: businessName || 'Logo', style: { height: 32, width: 32, objectFit: 'contain' } })) : null, (0, jsx_runtime_1.jsx)("strong", { children: businessName || '' })] }) }));
}
