import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
export function BrandThemeProvider({ config, children }) {
    const styleVars = useMemo(() => {
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
    return (_jsx("div", { style: styleVars, children: children }));
}
export default BrandThemeProvider;
