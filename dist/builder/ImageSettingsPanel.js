"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageSettingsPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const BuilderProvider_1 = require("./context/BuilderProvider");
function ImageSettingsPanel({ inline = false }) {
    const { draft, selectedIndex, updateSection, device } = (0, BuilderProvider_1.useBuilder)();
    const [open, setOpen] = react_1.default.useState(inline ? true : false);
    const [activeIdx, setActiveIdx] = react_1.default.useState(0);
    react_1.default.useEffect(() => {
        if (inline)
            return;
        const onOpen = () => setOpen(true);
        window.addEventListener('sb:open-media-settings', onOpen);
        return () => window.removeEventListener('sb:open-media-settings', onOpen);
    }, [inline]);
    if (!draft || selectedIndex == null)
        return null;
    const section = draft.sections[selectedIndex];
    const isHero = section?.type === 'hero';
    const images = [];
    if (isHero && section.backgroundImageUrl)
        images.push({ key: 'hero-bg', url: section.backgroundImageUrl, label: 'Background' });
    if (isHero && section.contentImageUrl)
        images.push({ key: 'hero-content', url: section.contentImageUrl, label: 'Content image' });
    if (section?.type === 'content_block') {
        const media = section.media || [];
        media.forEach((m, i) => images.push({ key: `cb-${i}`, url: m?.url, label: `Image ${i + 1}` }));
    }
    // Hide button when section has no images
    if (images.length === 0)
        return null;
    const active = images[activeIdx];
    const applyBulk = (patch) => {
        if (section?.type === 'content_block') {
            const media = (section.media || []).map((m) => ({ ...m, ...patch }));
            updateSection(selectedIndex, { media });
        }
    };
    const applyPerImage = (patch) => {
        if (active.key === 'hero-bg') {
            updateSection(selectedIndex, patch);
        }
        else if (active.key === 'hero-content') {
            updateSection(selectedIndex, patch);
        }
        else if (active.key.startsWith('cb-')) {
            const idx = parseInt(active.key.split('-')[1], 10);
            const media = Array.isArray(section.media) ? [...section.media] : [];
            media[idx] = { ...(media[idx] || {}), ...patch };
            updateSection(selectedIndex, { media });
        }
    };
    const body = ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: inline ? 8 : 12, display: 'grid', gap: 12 }, children: [section?.type === 'content_block' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 600 }, children: "Defaults for this section" }), (0, jsx_runtime_1.jsxs)("label", { children: ["Figure size (desktop)", (0, jsx_runtime_1.jsx)("select", { value: section.figureSize || 'L', onChange: e => updateSection(selectedIndex, { figureSize: e.target.value }), children: ['S', 'M', 'L'].map((s) => (0, jsx_runtime_1.jsx)("option", { value: s, children: s }, s)) })] }), (0, jsx_runtime_1.jsxs)("label", { style: { marginLeft: 12 }, children: ["Default fit", (0, jsx_runtime_1.jsxs)("select", { onChange: e => applyBulk({ fit: e.target.value }), children: [(0, jsx_runtime_1.jsx)("option", { value: '', children: "no change" }), ['cover', 'contain'].map((f) => (0, jsx_runtime_1.jsx)("option", { value: f, children: f }, f))] })] })] })), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 600 }, children: "Section images" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }, children: [images.map((im, i) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveIdx(i), style: { border: i === activeIdx ? '2px solid #111' : '1px solid var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }, children: [(0, jsx_runtime_1.jsx)("img", { src: im.url, alt: im.label, style: { width: '100%', height: 64, objectFit: 'cover', borderRadius: 4 } }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: 12, marginTop: 4 }, children: im.label })] }, im.key))), section?.type === 'content_block' && images.length < 3 && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            const media = Array.isArray(section.media) ? [...section.media] : [];
                            media.push({ url: '', alt: 'image' });
                            updateSection(selectedIndex, { media });
                            setActiveIdx(images.length);
                        }, style: { border: '1px dashed var(--sb-color-border)', borderRadius: 6, padding: 4, background: '#fff' }, children: "+ Add image" }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 600 }, children: "Selected image" }), active && ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 8 }, children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Image URL", (0, jsx_runtime_1.jsx)("input", { value: active.url || '', onChange: e => {
                                            const url = e.target.value;
                                            if (active.key === 'hero-bg')
                                                updateSection(selectedIndex, { backgroundImageUrl: url });
                                            else if (active.key === 'hero-content')
                                                updateSection(selectedIndex, { contentImageUrl: url });
                                            else if (active.key.startsWith('cb-')) {
                                                const idx = parseInt(active.key.split('-')[1], 10);
                                                const media = Array.isArray(section.media) ? [...section.media] : [];
                                                media[idx] = { ...(media[idx] || {}), url };
                                                updateSection(selectedIndex, { media });
                                            }
                                        }, style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] }), active.key === 'hero-content' && ((0, jsx_runtime_1.jsxs)("label", { children: ["Alt text", (0, jsx_runtime_1.jsx)("input", { value: section.contentImageAlt || '', onChange: e => updateSection(selectedIndex, { contentImageAlt: e.target.value }), style: { width: '100%', padding: '6px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 } })] })), (0, jsx_runtime_1.jsxs)("label", { children: ["Ratio", (0, jsx_runtime_1.jsx)("select", { onChange: e => applyPerImage({ contentImageRatio: e.target.value, ratio: e.target.value }), children: ['1x1', '4x3', '16x9', '3x4', '21x9', '5x3'].map(r => (0, jsx_runtime_1.jsx)("option", { value: r, children: r }, r)) })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["Fit", (0, jsx_runtime_1.jsx)("select", { onChange: e => applyPerImage({ contentImageFit: e.target.value, fit: e.target.value }), children: ['cover', 'contain'].map(f => (0, jsx_runtime_1.jsx)("option", { value: f, children: f }, f)) })] }), active.key.startsWith('cb-') && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    const idx = parseInt(active.key.split('-')[1], 10);
                                    const media = Array.isArray(section.media) ? [...section.media] : [];
                                    media.splice(idx, 1);
                                    updateSection(selectedIndex, { media });
                                    setActiveIdx(0);
                                }, style: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Remove image" })), active.key === 'hero-content' && ((0, jsx_runtime_1.jsxs)("label", { children: ["Size (desktop)", (0, jsx_runtime_1.jsx)("select", { value: section.contentImageSize || 'M', onChange: e => updateSection(selectedIndex, { contentImageSize: e.target.value }), children: ['S', 'M', 'L'].map(s => (0, jsx_runtime_1.jsx)("option", { value: s, children: s }, s)) })] })), active.key === 'hero-bg' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: ["Focal (", device, ")"] }), (0, jsx_runtime_1.jsx)("div", { style: { position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '16 / 9', background: `url(${active.url}) center/cover no-repeat`, border: '1px solid var(--sb-color-border)', borderRadius: 6 }, onClick: e => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                                            const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                                            const key = device === 'mobile' ? 'mobile' : 'desktop';
                                            const next = { backgroundFocal: { ...(section.backgroundFocal || {}), [key]: { xPct, yPct } } };
                                            updateSection(selectedIndex, next);
                                        } })] }))] }))] })] }));
    if (inline) {
        return ((0, jsx_runtime_1.jsx)("div", { children: body }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setOpen(true), style: { marginTop: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Configure media" }), open && ((0, jsx_runtime_1.jsxs)("div", { style: { position: 'fixed', inset: 0, display: 'grid', gridTemplateColumns: '360px 1fr', background: 'rgba(0,0,0,.04)', zIndex: 10 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { background: '#fff', borderRight: '1px solid var(--sb-color-border)', padding: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Image settings" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setOpen(false), style: { padding: '4px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }, children: "Close" })] }), body] }), (0, jsx_runtime_1.jsx)("div", { onClick: () => setOpen(false) })] }))] }));
}
