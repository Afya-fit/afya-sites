import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MediaFrame from '../../utils/MediaFrame';
export default function ContentBlock({ section }) {
    const { title, body, media = [], layout = 'media_top', textAlign = 'left' } = section;
    const isGrid = media.length >= 2;
    const anyData = globalThis.__SB_RENDER_DATA || {};
    const deviceHint = anyData.__preview_device;
    const isMobile = deviceHint === 'mobile';
    const mediaEl = media.length > 0 ? (isGrid ? (_jsx("div", { style: { display: 'grid', gap: 12, gridTemplateColumns: media.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)' }, children: media.slice(0, 3).map((m, i) => (_jsx("figure", { style: { margin: 0 }, children: _jsx(MediaFrame, { src: m.url, alt: m.alt, ratio: m.ratio || '4x3', fit: m.fit || 'contain' }) }, i))) })) : (_jsx("figure", { style: { margin: 0 }, children: isMobile ? (_jsx("div", { style: { maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }, children: _jsx(MediaFrame, { src: media[0].url, alt: media[0].alt, ratio: media[0].ratio || '16x9', fit: media[0].fit || 'cover' }) })) : (_jsx(MediaFrame, { src: media[0].url, alt: media[0].alt, ratio: media[0].ratio || '16x9', fit: media[0].fit || 'cover' })) }))) : null;
    const textEl = (_jsxs("div", { style: { textAlign }, children: [title ? _jsx("h2", { style: { marginTop: 0 }, children: title }) : null, body ? _jsx("p", { children: body }) : null] }));
    let content;
    if (layout === 'media_left') {
        content = (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }, children: [mediaEl, textEl] }));
    }
    else if (layout === 'media_right') {
        content = (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }, children: [textEl, mediaEl] }));
    }
    else if (layout === 'media_top') {
        content = (_jsxs("div", { style: { display: 'grid', gap: 16 }, children: [isMobile ? (_jsx("div", { style: { maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }, children: mediaEl })) : (_jsx("div", { style: { maxWidth: section.figureSize === 'S' ? 360 : section.figureSize === 'M' ? 640 : 960, marginInline: 'auto', width: '100%' }, children: mediaEl })), textEl] }));
    }
    else {
        content = textEl;
    }
    return (_jsx("section", { style: { padding: '40px 16px', borderBottom: '1px solid #eee' }, children: _jsx("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: content }) }));
}
