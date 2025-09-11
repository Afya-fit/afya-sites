"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectionRenderer;
const jsx_runtime_1 = require("react/jsx-runtime");
const Hero_1 = __importDefault(require("./components/sections/Hero"));
const ContentBlock_1 = __importDefault(require("./components/sections/ContentBlock"));
const BusinessData_1 = __importDefault(require("./components/sections/BusinessData"));
const SpecialOffers_1 = __importDefault(require("./components/sections/SpecialOffers"));
const LinksPage_1 = __importDefault(require("./components/sections/LinksPage"));
const Schedule_1 = __importDefault(require("./components/sections/Schedule"));
const SiteHeader_1 = __importDefault(require("./components/SiteHeader"));
function SectionRenderer(props) {
    const { sections } = props;
    const visible = props.data?.__visible_indices;
    if (!sections || sections.length === 0) {
        return null;
    }
    // Expose data to children without prop-drilling for preview hints
    ;
    globalThis.__SB_RENDER_DATA = props.data;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SiteHeader_1.default, { businessName: props.data?.platform_data?.business_info?.name || '' }), sections.map((section, index) => {
                if (Array.isArray(visible) && !visible.includes(index))
                    return null;
                switch (section.type) {
                    case 'hero':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(Hero_1.default, { section: section }) }, index));
                    case 'content_block':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(ContentBlock_1.default, { section: section }) }, index));
                    case 'business_data':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(BusinessData_1.default, { section: section, data: props.data }) }, index));
                    case 'special_offers':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(SpecialOffers_1.default, { section: section }) }, index));
                    case 'links_page':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(LinksPage_1.default, { section: section }) }, index));
                    case 'schedule':
                        return ((0, jsx_runtime_1.jsx)("div", { "data-sb-section-index": index, children: (0, jsx_runtime_1.jsx)(Schedule_1.default, { section: section, data: props.data }) }, index));
                    default:
                        return null;
                }
            })] }));
}
