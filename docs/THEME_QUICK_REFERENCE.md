# Theme System Quick Reference

## Theme v1.0 Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme_version` | `string` | `'1.0'` | Version identifier |
| `mode` | `'light' \| 'dark'` | `'light'` | Color scheme |
| `accent` | `string` | `'blue'` | Brand color palette |
| `typography.preset` | `string` | `'modern'` | Font combination |
| `typography.sizeScale` | `'standard' \| 'large'` | `'standard'` | Font size multiplier |

## Accent Colors

| Value | Color | Hex |
|-------|-------|-----|
| `'blue'` | Blue | `#3B82F6` |
| `'green'` | Green | `#10B981` |
| `'purple'` | Purple | `#8B5CF6` |
| `'orange'` | Orange | `#F59E0B` |
| `'red'` | Red | `#EF4444` |
| `'neutral'` | Gray | `#6B7280` |
| Custom | Any | `#RRGGBB` |

## Typography Presets

| Preset | Heading Font | Body Font | Style |
|--------|-------------|-----------|-------|
| `'modern'` | Inter | Inter | Clean, contemporary |
| `'classic'` | Lora | Lato | Traditional, readable |
| `'minimal'` | Manrope | Manrope | Simple, geometric |
| `'energetic'` | Poppins | Open Sans | Bold, dynamic |
| `'friendly'` | Nunito | Nunito | Warm, approachable |

## Size Scales

| Scale | Multiplier | Use Case |
|-------|------------|----------|
| `'standard'` | 1.0x | Normal readability |
| `'large'` | 1.25x | Accessibility, mobile |

## CSS Variables Generated

```css
/* Colors */
--sb-color-surface: #ffffff;
--sb-color-text: #000000;
--sb-color-brand: #3B82F6;
--sb-color-brand-contrast: #ffffff;

/* Typography */
--sb-font-family-heading: 'Inter', sans-serif;
--sb-font-family-body: 'Inter', sans-serif;
--sb-size-multiplier: 1.0;

/* Responsive Font Sizes */
--fs-hero: clamp(32px, 5vw, 72px);
--fs-h1: clamp(28px, 5.5vw, 56px);
--fs-h2: clamp(24px, 5vw, 36px);
--fs-body: clamp(16px, 3.5vw, 18px);
```

### Icons

Framework variables influencing icons:

```css
--sb-icon-size: 1em;           /* icon size; can be px/rem */
--sb-icon-color: currentColor; /* icon color; inherits text by default */
```

Developer usage:

```tsx
import Icon from '../src/renderer/utils/Icon'
<Icon name="phone" />              // lucide:phone
<Icon name="instagram" />          // simple-icons:instagram
<Icon name="lucide:calendar" />
<Icon name="simple-icons:tiktok" />
```

## Usage Examples

### Basic Theme
```typescript
const theme: SiteTheme = {
  theme_version: '1.0',
  mode: 'light',
  accent: 'blue'
}
```

### Custom Theme
```typescript
const theme: SiteTheme = {
  theme_version: '1.0',
  mode: 'dark',
  accent: '#FF6B6B', // Custom color
  typography: {
    preset: 'energetic',
    sizeScale: 'large'
  }
}
```

### Theme Provider Usage
```typescript
<BrandThemeProvider config={{ theme }}>
  <YourSiteContent />
</BrandThemeProvider>
```

## Migration Checklist

When adding new theme properties:

- [ ] Update `SiteTheme` type in `types.ts`
- [ ] Add to `DEFAULT_THEME` in `BuilderProvider.tsx`
- [ ] Implement in `BrandThemeProvider.tsx`
- [ ] Update this reference
- [ ] Test backward compatibility

## Draft Metadata

### Structure
```typescript
interface DraftMeta {
  draftName?: string        // User-defined draft name
  lastModified?: string     // ISO timestamp
  author?: string          // User ID
  tags?: string[]          // Custom tags
}
```

### Usage in Site Config
```typescript
interface SiteConfig {
  version: string
  business_id: string
  theme: SiteTheme
  sections: SectionUnion[]
  meta?: DraftMeta         // Optional metadata
}
```

### Version History Integration
- Draft names appear in version notes: `"Draft Name - Version from Date"`
- Stored in `draft.meta.draftName` for easy access
- Backward compatible with unnamed drafts
- Enhanced version display with metadata

## Related Files

- `src/renderer/types.ts` - Type definitions
- `src/renderer/theme/BrandThemeProvider.tsx` - Implementation
- `src/builder/context/BuilderProvider.tsx` - State management
- `src/builder/VersionHistoryPanel.tsx` - Version history implementation
- `docs/THEME_VERSIONING.md` - Complete documentation
- `docs/VERSION_HISTORY_SYSTEM.md` - Version history documentation
- `docs/DRAFT_MANAGEMENT.md` - Draft management documentation
