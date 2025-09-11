import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Hero from './components/sections/Hero';
import ContentBlock from './components/sections/ContentBlock';
import BusinessData from './components/sections/BusinessData';
import SpecialOffers from './components/sections/SpecialOffers';
import LinksPage from './components/sections/LinksPage';
import Schedule from './components/sections/Schedule';
import SiteHeader from './components/SiteHeader';
export default function SectionRenderer(props) {
    const { sections } = props;
    const visible = props.data?.__visible_indices;
    if (!sections || sections.length === 0) {
        return null;
    }
    // Expose data to children without prop-drilling for preview hints
    ;
    globalThis.__SB_RENDER_DATA = props.data;
    return (_jsxs("div", { children: [_jsx(SiteHeader, { businessName: props.data?.platform_data?.business_info?.name || '' }), sections.map((section, index) => {
                if (Array.isArray(visible) && !visible.includes(index))
                    return null;
                switch (section.type) {
                    case 'hero':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(Hero, { section: section }) }, index));
                    case 'content_block':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(ContentBlock, { section: section }) }, index));
                    case 'business_data':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(BusinessData, { section: section, data: props.data }) }, index));
                    case 'special_offers':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(SpecialOffers, { section: section }) }, index));
                    case 'links_page':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(LinksPage, { section: section }) }, index));
                    case 'schedule':
                        return (_jsx("div", { "data-sb-section-index": index, children: _jsx(Schedule, { section: section, data: props.data }) }, index));
                    default:
                        return null;
                }
            })] }));
}
