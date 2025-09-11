"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContentBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const MediaFrame_1 = __importDefault(require("../../utils/MediaFrame"));
function ContentBlock({ section }) {
    const { title, body, media = [], layout = 'media_top', textAlign = 'left' } = section;
    const isGrid = media.length >= 2;
    const anyData = globalThis.__SB_RENDER_DATA || {};
    const deviceHint = anyData.__preview_device;
    const isMobile = deviceHint === 'mobile';
    const mediaEl = media.length > 0 ? (isGrid ? ((0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gap: 12, gridTemplateColumns: media.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)' }, children: media.slice(0, 3).map((m, i) => ((0, jsx_runtime_1.jsx)("figure", { style: { margin: 0 }, children: (0, jsx_runtime_1.jsx)(MediaFrame_1.default, { src: m.url, alt: m.alt, ratio: m.ratio || '4x3', fit: m.fit || 'contain' }) }, i))) })) : ((0, jsx_runtime_1.jsx)("figure", { style: { margin: 0 }, children: isMobile ? ((0, jsx_runtime_1.jsx)("div", { style: { maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }, children: (0, jsx_runtime_1.jsx)(MediaFrame_1.default, { src: media[0].url, alt: media[0].alt, ratio: media[0].ratio || '16x9', fit: media[0].fit || 'cover' }) })) : ((0, jsx_runtime_1.jsx)(MediaFrame_1.default, { src: media[0].url, alt: media[0].alt, ratio: media[0].ratio || '16x9', fit: media[0].fit || 'cover' })) }))) : null;
    const textEl = ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign }, children: [title ? (0, jsx_runtime_1.jsx)("h2", { style: { marginTop: 0 }, children: title }) : null, body ? (0, jsx_runtime_1.jsx)("p", { children: body }) : null] }));
    let content;
    if (layout === 'media_left') {
        content = ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }, children: [mediaEl, textEl] }));
    }
    else if (layout === 'media_right') {
        content = ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }, children: [textEl, mediaEl] }));
    }
    else if (layout === 'media_top') {
        content = ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 16 }, children: [isMobile ? ((0, jsx_runtime_1.jsx)("div", { style: { maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }, children: mediaEl })) : ((0, jsx_runtime_1.jsx)("div", { style: { maxWidth: section.figureSize === 'S' ? 360 : section.figureSize === 'M' ? 640 : 960, marginInline: 'auto', width: '100%' }, children: mediaEl })), textEl] }));
    }
    else {
        content = textEl;
    }
    return ((0, jsx_runtime_1.jsx)("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: (0, jsx_runtime_1.jsx)("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: content }) }));
}
