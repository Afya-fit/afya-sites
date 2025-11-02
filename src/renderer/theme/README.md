# Theme System

This directory contains the theme system implementation for the Site Builder.

## Files

- `BrandThemeProvider.tsx` - Main theme provider component that converts theme configuration to CSS variables
- `README.md` - This file

## Quick Start

```typescript
import { BrandThemeProvider } from './theme/BrandThemeProvider'

// Wrap your site content with the theme provider
<BrandThemeProvider config={siteConfig}>
  <YourSiteContent />
</BrandThemeProvider>
```

## Theme Configuration

```typescript
const theme: SiteTheme = {
  theme_version: '1.0',
  mode: 'light',
  accent: 'blue',
  typography: {
    preset: 'modern',
    sizeScale: 'standard'
  }
}
```

## Documentation

- **Complete Documentation**: [THEME_VERSIONING.md](../../docs/THEME_VERSIONING.md)
- **Type Definitions**: [types.ts](../types.ts) - `SiteTheme` interface
- **Usage Examples**: See `BrandThemeProvider.tsx` for implementation details

## Key Concepts

1. **Theme Versioning**: Enables evolution without breaking existing sites
2. **CSS Variables**: All styling is applied via CSS custom properties
3. **Responsive Design**: Typography scales automatically across devices
4. **Color Palettes**: Predefined accent colors with custom color support
5. **Font Presets**: Curated font combinations for different styles

## Icons (Framework-Aligned)

The framework provides a lightweight Icon wrapper that renders inline SVG via Iconify and is fully controlled by CSS variables.

Usage:

```tsx
import Icon from '../utils/Icon'

// Action icons (Lucide)
<Icon name="phone" />
<Icon name="lucide:map-pin" />

// Brand icons (Simple Icons)
<Icon name="instagram" />
<Icon name="simple-icons:tiktok" />
```

Styling (One-Path variables):

```css
.some-scope {
  --sb-icon-size: 20px;          /* defaults to 1em */
  --sb-icon-color: currentColor; /* inherits text color by default */
}
```

Accessibility:

- Decorative icons: omit `title` (wrapper sets `aria-hidden`).
- Meaningful icons: pass `title` to announce to screen readers.

Notes:

- Generic/action icons map to `lucide:*`; brands to `simple-icons:*`.
- Friendly names are resolved automatically (e.g., `instagram`, `tiktok`, `phone`, `mail`).
- Search icons: https://icon-sets.iconify.design/

## Adding New Theme Properties

1. Update `SiteTheme` type in `types.ts`
2. Add defaults to `DEFAULT_THEME` in `BuilderProvider.tsx`
3. Implement resolution logic in `BrandThemeProvider.tsx`
4. Update documentation in `THEME_VERSIONING.md`

## Version History

- **v1.0** - Initial theme system with core styling controls
  - Color modes (light/dark)
  - Accent color palettes
  - Typography presets and scaling
  - Responsive design tokens
