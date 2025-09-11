"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectionManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const BuilderProvider_1 = require("./context/BuilderProvider");
const sectionRegistry_1 = require("../renderer/sectionRegistry");
const HeroEditor_1 = __importDefault(require("./InlineEditors/HeroEditor"));
const ContentBlockEditor_1 = __importDefault(require("./InlineEditors/ContentBlockEditor"));
const BusinessDataEditor_1 = __importDefault(require("./InlineEditors/BusinessDataEditor"));
const LinksPageEditor_1 = __importDefault(require("./InlineEditors/LinksPageEditor"));
const ScheduleEditor_1 = __importDefault(require("./InlineEditors/ScheduleEditor"));
const ImageSettingsPanel_1 = __importDefault(require("./ImageSettingsPanel"));
function SectionManager() {
    const { draft, addSection, removeSection, selectedIndex, setSelectedIndex, reorderSections } = (0, BuilderProvider_1.useBuilder)();
    const sections = draft?.sections || [];
    const hasLinks = sections.some(s => s.type === 'links_page');
    const [dragIndex, setDragIndex] = react_1.default.useState(null);
    const [dropIndex, setDropIndex] = react_1.default.useState(null);
    const [dropAtEnd, setDropAtEnd] = react_1.default.useState(false);
    const handleDropReorder = (fromIndex, toIndex) => {
        if (!Array.isArray(sections) || fromIndex === toIndex)
            return;
        // Prevent dragging the links_page and prevent dropping into index 0
        const fromItem = sections[fromIndex];
        if (!fromItem || fromItem.type === 'links_page')
            return;
        const safeToIndex = Math.max(1, toIndex);
        const next = [...sections];
        const [moved] = next.splice(fromIndex, 1);
        // Adjust index if removing before insertion point
        const adjustedIndex = fromIndex < safeToIndex ? safeToIndex - 1 : safeToIndex;
        next.splice(adjustedIndex, 0, moved);
        // Enforce links_page stays at top if present
        const linkIdx = next.findIndex(s => s.type === 'links_page');
        if (linkIdx > 0) {
            const [link] = next.splice(linkIdx, 1);
            next.unshift(link);
        }
        reorderSections(next);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12, padding: 12, border: '1px solid var(--sb-color-border)', borderRadius: 8 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Sections" }), (0, sectionRegistry_1.isAddable)('hero') && (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            addSection({ type: 'hero', title: 'New Hero', subtitle: 'Edit me', align: 'center', valign: 'center', brandEmphasis: true });
                            setSelectedIndex(sections.length);
                        }, style: { marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Hero" }), (0, sectionRegistry_1.isAddable)('content_block') && (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            addSection({ type: 'content_block', title: 'Content Block', body: 'Write copy here', layout: 'media_top', background: 'surface', textAlign: 'left', media: [] });
                            setSelectedIndex(sections.length);
                        }, style: { marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Content Block" }), (0, sectionRegistry_1.isAddable)('business_data') && (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            addSection({ type: 'business_data', title: 'Business', fields: ['business_info'] });
                            setSelectedIndex(sections.length);
                        }, style: { marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Business Data" }), (0, sectionRegistry_1.isAddable)('schedule') && (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            addSection({ type: 'schedule', title: 'Schedule', windowDays: 7 });
                            setSelectedIndex(sections.length);
                        }, style: { marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Schedule" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            if (hasLinks)
                                return;
                            // insert at top and select it
                            const next = [{ type: 'links_page', title: 'Links', links: [] }, ...sections.filter(s => s.type !== 'links_page')];
                            reorderSections(next);
                            setSelectedIndex(0);
                        }, disabled: hasLinks, title: hasLinks ? 'Only one Links List allowed' : 'Add a Link-in-bio list at the top', style: { marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Add Links List" })] }), sections.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { style: { marginTop: 8, opacity: .7 }, children: "No sections yet. Click \u201CAdd Hero\u201D to start." })) : ((0, jsx_runtime_1.jsx)("ul", { style: { listStyle: 'none', padding: 0, margin: '8px 0 0 0' }, children: sections.map((s, i) => ((0, jsx_runtime_1.jsxs)("li", { draggable: s.type !== 'links_page', onDragStart: (e) => {
                        if (s.type === 'links_page') {
                            e.preventDefault();
                            return;
                        }
                        setDragIndex(i);
                        setSelectedIndex(null);
                        try {
                            e.dataTransfer?.setData('text/plain', String(i));
                        }
                        catch { }
                    }, onDragOver: (e) => { e.preventDefault(); setDropIndex(i); setDropAtEnd(false); }, onDrop: (e) => {
                        e.preventDefault();
                        const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1);
                        setDragIndex(null);
                        setDropIndex(null);
                        setDropAtEnd(false);
                        if (Number.isNaN(from) || from < 0)
                            return;
                        handleDropReorder(from, i);
                    }, onDragEnd: () => { setDragIndex(null); setDropIndex(null); setDropAtEnd(false); }, style: { padding: '6px 0', borderTop: i ? '1px solid var(--sb-color-border)' : undefined }, children: [dragIndex != null && dropIndex === i && i !== 0 ? ((0, jsx_runtime_1.jsx)("div", { style: { height: 8, margin: '0 0 6px 0', borderTop: '2px solid #111', borderRadius: 2, opacity: .8 } })) : null, (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 8, background: selectedIndex === i ? '#f5f5f5' : 'transparent' }, children: [(0, jsx_runtime_1.jsxs)("span", { style: { width: 24, textAlign: 'right', opacity: .6 }, children: [i + 1, "."] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedIndex(selectedIndex === i ? null : i), style: { textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'capitalize', padding: 0 }, title: s.type === 'links_page' ? 'Links List renders only when selected' : undefined, children: s.type === 'links_page' ? 'links list (link-in-bio)' : s.type.replace('_', ' ') }), 'title' in s && s.title ? (0, jsx_runtime_1.jsxs)("span", { style: { opacity: .7 }, children: ["\u2014 ", s.title] }) : null, (0, jsx_runtime_1.jsx)("button", { onClick: () => removeSection(i), style: { marginLeft: 'auto', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Remove" })] }), selectedIndex === i && ((0, jsx_runtime_1.jsx)(SectionEditorContainer, { sectionType: s.type }))] }, i))) })), dragIndex != null && ((0, jsx_runtime_1.jsx)("div", { onDragOver: (e) => { e.preventDefault(); setDropAtEnd(true); setDropIndex(sections.length); }, onDrop: (e) => {
                    e.preventDefault();
                    const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1);
                    setDragIndex(null);
                    setDropIndex(null);
                    setDropAtEnd(false);
                    if (Number.isNaN(from) || from < 0)
                        return;
                    handleDropReorder(from, sections.length);
                }, style: {
                    marginTop: 6,
                    padding: '8px 8px',
                    border: '1px dashed var(--sb-color-border)',
                    borderRadius: 6,
                    textAlign: 'center',
                    background: dropAtEnd ? '#fafafa' : 'transparent',
                    color: 'var(--sb-color-text)',
                    fontSize: 12,
                }, children: "Drop here to place last" }))] }));
}
function SectionEditorContainer({ sectionType }) {
    const { panelView, setPanelView } = (0, BuilderProvider_1.useBuilder)();
    if (panelView === 'media') {
        return ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 8 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setPanelView('editor'), style: { padding: '4px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }, children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("strong", { style: { marginLeft: 4 }, children: "Image settings" })] }), (0, jsx_runtime_1.jsx)(InlineImageSettings, {})] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [sectionType === 'hero' && (0, jsx_runtime_1.jsx)(HeroEditor_1.default, {}), sectionType === 'content_block' && (0, jsx_runtime_1.jsx)(ContentBlockEditor_1.default, {}), sectionType === 'business_data' && (0, jsx_runtime_1.jsx)(BusinessDataEditor_1.default, {}), sectionType === 'links_page' && (0, jsx_runtime_1.jsx)(LinksPageEditor_1.default, {}), sectionType === 'schedule' && (0, jsx_runtime_1.jsx)(ScheduleEditor_1.default, {})] }));
}
function InlineImageSettings() {
    // Reuse the existing panel component but render its inner content inline
    // We'll import and render ImageSettingsPanel inline without the overlay/backdrop
    return (0, jsx_runtime_1.jsx)(ImageSettingsPanel_1.default, { inline: true });
}
