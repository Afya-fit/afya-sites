"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const jsx_runtime_1 = require("react/jsx-runtime");
const MediaFrame_1 = __importDefault(require("../../utils/MediaFrame"));
function Hero({ section }) {
    const { title, subtitle, backgroundImageUrl, backgroundFocal, contentImageUrl, align = 'center', valign = 'center', brandEmphasis } = section;
    const alignItems = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    const justifyContent = valign === 'top' ? 'flex-start' : valign === 'bottom' ? 'flex-end' : 'center';
    // Choose focal based on preview device hint if present
    const anyData = globalThis.__SB_RENDER_DATA || {};
    const deviceHint = anyData.__preview_device;
    const focal = deviceHint === 'mobile' ? backgroundFocal?.mobile || backgroundFocal?.desktop : backgroundFocal?.desktop;
    const bgPos = focal ? `${focal.xPct}% ${focal.yPct}%` : 'center center';
    return ((0, jsx_runtime_1.jsx)("section", { "aria-label": "Hero", style: {
            position: 'relative',
            padding: '56px 16px',
            minHeight: 280,
            background: backgroundImageUrl
                ? `url(${backgroundImageUrl}) ${bgPos}/cover no-repeat`
                : brandEmphasis
                    ? 'linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%)'
                    : '#ffffff',
            borderBottom: '1px solid #eee',
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                maxWidth: 1000,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems,
                justifyContent,
                gap: 12,
                textAlign: align === 'left' ? 'left' : align === 'right' ? 'right' : 'center',
                minHeight: 200,
            }, children: [contentImageUrl ? ((0, jsx_runtime_1.jsx)("div", { style: { maxWidth: '100%', marginInline: 0, alignSelf: 'auto' }, children: (0, jsx_runtime_1.jsx)(MediaFrame_1.default, { src: contentImageUrl, alt: section.contentImageAlt || title || 'Hero image', ratio: section.contentImageRatio || '16x9', fit: section.contentImageFit || 'cover', heightPx: section.contentImageSize === 'S' ? 120 : section.contentImageSize === 'L' ? 200 : 160 }) })) : null, title ? ((0, jsx_runtime_1.jsx)("h1", { style: { margin: 0 }, children: title })) : null, subtitle ? ((0, jsx_runtime_1.jsx)("p", { style: { margin: 0, color: '#555' }, children: subtitle })) : null] }) }));
}
