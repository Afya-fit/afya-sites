"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCtaHref = buildCtaHref;
function buildCtaHref(baseHref, utm) {
    try {
        const url = new URL(baseHref, 'https://example.com');
        if (utm) {
            Object.entries(utm).forEach(([key, value]) => {
                if (value)
                    url.searchParams.set(key, value);
            });
        }
        const href = url.href.replace('https://example.com', '');
        return href;
    }
    catch {
        return baseHref;
    }
}
