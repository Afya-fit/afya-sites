"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandThemeProvider = BrandThemeProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function BrandThemeProvider({ config, children }) {
    const styleVars = (0, react_1.useMemo)(() => {
        const mode = config?.theme?.mode || 'light';
        const surface = mode === 'dark' ? '#0f1115' : '#ffffff';
        const text = mode === 'dark' ? '#eaeaea' : '#111111';
        const border = mode === 'dark' ? '#22262e' : '#e6e6e6';
        const brand = config?.theme?.accent === 'brand' ? '#2563eb' : '#6b7280';
        return {
            // Surface colors
            ['--sb-color-surface']: surface,
            ['--sb-color-text']: text,
            ['--sb-color-border']: border,
            ['--sb-color-brand']: brand,
        };
    }, [config]);
    return ((0, jsx_runtime_1.jsx)("div", { style: styleVars, children: children }));
}
exports.default = BrandThemeProvider;
