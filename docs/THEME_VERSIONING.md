# Theme Versioning System

## Overview

The Site Builder uses a theme versioning system to ensure backward compatibility and enable future evolution of styling capabilities without breaking existing sites.

## Core Concepts

### Theme Version Field
- **Field**: `theme_version` in `SiteTheme` type
- **Purpose**: Enables independent evolution of styling without breaking existing sites
- **Current Version**: `1.1`
- **Format**: Semantic versioning (e.g., `1.0`, `1.1`, `2.0`)
- **Migration**: Automatic migration from v1.0 → v1.1

### Version Strategy
- **Backward Compatible**: New versions must not break existing sites
- **Graceful Degradation**: Missing properties fall back to sensible defaults
- **Migration Path**: Clear upgrade path for major version changes

## Theme v1.1 Specification (Current)

### Enhanced Display/Text Typography Hierarchy

```typescript
type SiteTheme = {
  theme_version?: string; // '1.1' - Enhanced Display/Text typography hierarchy
  mode?: 'light' | 'dark';
  accent?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | string;
  typography?: {
    preset?: 'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly' | 'system';
    
    // NEW: Display/Text hierarchy system
    displayScale?: 'compact' | 'standard' | 'expressive' | 'dramatic';
    textScale?: 'compact' | 'standard' | 'comfortable';
    adaptiveTitles?: boolean; // Default: true
    
    // Legacy (for backward compatibility)
    sizeScale?: 'standard' | 'large';
  };
};
```

### Section-Level Typography Overrides

```typescript
interface TypographyOverride {
  displayScale?: 'compact' | 'standard' | 'expressive' | 'dramatic';
  textScale?: 'compact' | 'standard' | 'comfortable';
  fontPreset?: 'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly' | 'system';
  disableAdaptiveTitles?: boolean;
  customScaling?: {
    title?: number;
    subtitle?: number;
    body?: number;
  };
}

// All section types now support typography overrides
type HeroSection = {
  // ... existing properties
  typographyOverride?: TypographyOverride;
};
```

## Theme v1.0 Specification (Legacy)

### Core Properties

```typescript
type SiteTheme = {
  theme_version?: string; // '1.0' - Initial theme system
  mode?: 'light' | 'dark';
  accent?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | string;
  typography?: {
    preset?: 'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly';
    sizeScale?: 'standard' | 'large';
  };
}
```

### Property Details

#### `theme_version`
- **Type**: `string`
- **Default**: `'1.0'`
- **Purpose**: Version identifier for theme compatibility
- **Usage**: Used by `BrandThemeProvider` to determine which styling rules to apply

#### `mode`
- **Type**: `'light' | 'dark'`
- **Default**: `'light'`
- **Purpose**: Controls overall color scheme
- **Impact**: Affects all color tokens (surface, text, brand, etc.)

#### `accent`
- **Type**: `'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | string`
- **Default**: `'blue'`
- **Purpose**: Primary brand color palette
- **Impact**: Controls brand colors, CTAs, and accent elements

#### `typography.preset`
- **Type**: `'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly'`
- **Default**: `'modern'`
- **Purpose**: Font family combinations
- **Impact**: Sets heading and body font families

#### `typography.sizeScale`
- **Type**: `'standard' | 'large'`
- **Default**: `'standard'`
- **Purpose**: Global font size scaling
- **Impact**: Multiplies all font sizes by 1.0 (standard) or 1.25 (large)

### v1.1 New Properties

#### `typography.displayScale`
- **Type**: `'compact' | 'standard' | 'expressive' | 'dramatic'`
- **Default**: `'standard'`
- **Purpose**: Controls display typography (titles, headings, hero text)
- **Impact**: Adjusts font sizes for attention-grabbing elements
- **Sizes**:
  - **Compact**: Professional/conservative (Hero: 40-56px, H2: 22-28px)
  - **Standard**: Balanced default (Hero: 48-72px, H2: 24-36px)
  - **Expressive**: Creative/lifestyle (Hero: 56-84px, H2: 28-42px)
  - **Dramatic**: Bold/statement (Hero: 64-96px, H2: 32-48px)

#### `typography.textScale`
- **Type**: `'compact' | 'standard' | 'comfortable'`
- **Default**: `'standard'`
- **Purpose**: Controls text typography (body, descriptions, UI)
- **Impact**: Adjusts font sizes for reading-optimized content
- **Sizes**:
  - **Compact**: Dense layout (Body: 14-16px, Subtitle: 16-18px)
  - **Standard**: Balanced readability (Body: 16-18px, Subtitle: 18-22px)
  - **Comfortable**: Spacious reading (Body: 17-19px, Subtitle: 19-24px)

#### `typography.adaptiveTitles`
- **Type**: `boolean`
- **Default**: `true`
- **Purpose**: Enable/disable dynamic title scaling based on text length
- **Impact**: Automatically reduces font size for longer titles to prevent overflow

#### `typography.preset` (Enhanced)
- **New Option**: `'system'` - Uses native system fonts for fast loading

### Section-Level Typography Overrides

All section types now support `typographyOverride` property for fine-grained control:

```typescript
// Example: Make a specific hero section extra dramatic
{
  type: 'hero',
  title: 'Special Event',
  typographyOverride: {
    displayScale: 'dramatic',
    customScaling: { title: 1.2 } // 20% larger than theme default
  }
}
```

## Migration v1.0 → v1.1

### Automatic Migration
The system automatically migrates v1.0 themes to v1.1:

```typescript
// v1.0 theme
{
  theme_version: '1.0',
  typography: { preset: 'modern', sizeScale: 'large' }
}

// Automatically becomes v1.1
{
  theme_version: '1.1',
  typography: {
    preset: 'modern',
    displayScale: 'expressive', // mapped from sizeScale: 'large'
    textScale: 'comfortable',   // mapped from sizeScale: 'large'
    adaptiveTitles: true,       // enabled by default
    sizeScale: 'large'          // kept for backward compatibility
  }
}
```

### Migration Rules
- `sizeScale: 'standard'` → `displayScale: 'standard'`, `textScale: 'standard'`
- `sizeScale: 'large'` → `displayScale: 'expressive'`, `textScale: 'comfortable'`
- `adaptiveTitles` defaults to `true`
- Legacy `sizeScale` is preserved for compatibility

## Implementation Details

### BrandThemeProvider Integration

The `BrandThemeProvider` component handles theme versioning:

```typescript
// Default theme with complete v1.0 structure
const DEFAULT_THEME = {
  theme_version: '1.0',
  mode: 'light' as const,
  accent: 'blue' as const,
  typography: {
    preset: 'modern' as const,
    sizeScale: 'standard' as const
  }
}
```

### CSS Variable Generation

Theme properties are converted to CSS variables:

```typescript
// Example: Accent color resolution
const resolveAccent = (accent: string) => {
  const accentMap = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    orange: '#F59E0B',
    red: '#EF4444',
    neutral: '#6B7280'
  }
  return accentMap[accent] || accent // Support custom colors
}
```

### Size Scaling Implementation

```css
/* CSS variables with size multiplier */
--sb-size-multiplier: 1.0; /* or 1.25 for large scale */

/* Font sizes use calc() with multiplier */
--fs-hero: clamp(calc(32px * var(--sb-size-multiplier)), 5vw, calc(72px * var(--sb-size-multiplier)));
```

## Migration Strategy

### Adding New Properties

When adding new theme properties in future versions:

1. **Add to TypeScript types** with optional properties
2. **Provide sensible defaults** in `DEFAULT_THEME`
3. **Update `BrandThemeProvider`** to handle new properties
4. **Maintain backward compatibility** - existing themes should continue working

### Example: Adding v1.1 Properties

```typescript
// v1.1 addition
type SiteTheme = {
  theme_version?: string;
  mode?: 'light' | 'dark';
  accent?: string;
  typography?: {
    preset?: string;
    sizeScale?: 'standard' | 'large';
    // NEW in v1.1
    lineHeight?: 'tight' | 'normal' | 'relaxed';
    letterSpacing?: 'tight' | 'normal' | 'wide';
  };
  // NEW in v1.1
  spacing?: {
    scale?: 'compact' | 'standard' | 'comfortable';
  };
}
```

### Major Version Changes

For breaking changes (v2.0+):

1. **Create migration utilities** to transform old themes
2. **Maintain dual support** during transition period
3. **Provide clear upgrade path** with documentation
4. **Version detection** in `BrandThemeProvider`

## Best Practices

### For Developers

1. **Always check `theme_version`** before applying version-specific logic
2. **Provide fallbacks** for missing properties
3. **Test with different versions** to ensure compatibility
4. **Document breaking changes** clearly

### For Designers

1. **Use semantic property names** that describe purpose, not implementation
2. **Consider backward compatibility** when adding new features
3. **Provide clear migration guides** for major changes
4. **Test across different theme versions**

## Code Examples

### Creating a New Theme

```typescript
const customTheme: SiteTheme = {
  theme_version: '1.0',
  mode: 'dark',
  accent: 'purple',
  typography: {
    preset: 'energetic',
    sizeScale: 'large'
  }
}
```

### Checking Theme Version

```typescript
const isV1Theme = (theme: SiteTheme) => {
  return !theme.theme_version || theme.theme_version.startsWith('1.')
}

const supportsSpacing = (theme: SiteTheme) => {
  return theme.theme_version === '1.1' || theme.theme_version === '2.0'
}
```

### Migration Utility

```typescript
const migrateTheme = (theme: SiteTheme): SiteTheme => {
  if (!theme.theme_version || theme.theme_version === '1.0') {
    return {
      ...theme,
      theme_version: '1.1',
      // Add new v1.1 defaults
      typography: {
        ...theme.typography,
        lineHeight: 'normal',
        letterSpacing: 'normal'
      }
    }
  }
  return theme
}
```

## Future Considerations

### Planned Enhancements

- **v1.1**: Advanced typography controls (line height, letter spacing)
- **v1.2**: Spacing scale customization
- **v1.3**: Animation and transition controls
- **v2.0**: Component-level theming

### Architecture Evolution

- **Theme Registry**: Centralized theme definitions
- **Migration Engine**: Automated theme upgrades
- **Validation System**: Theme property validation
- **Preview System**: Real-time theme preview

## Troubleshooting

### Common Issues

1. **Missing theme_version**: Defaults to v1.0 behavior
2. **Invalid accent color**: Falls back to custom color or blue
3. **Missing typography**: Uses modern preset with standard scale
4. **Version mismatch**: Graceful degradation to closest supported version

### Debug Tools

```typescript
// Debug theme resolution
console.log('Theme version:', theme.theme_version)
console.log('Resolved accent:', resolveAccent(theme.accent))
console.log('Size multiplier:', getSizeMultiplier(theme.typography?.sizeScale))
```

## Related Files

- `src/renderer/types.ts` - TypeScript definitions
- `src/renderer/theme/BrandThemeProvider.tsx` - Theme implementation
- `src/builder/context/BuilderProvider.tsx` - Theme state management
- `src/builder/BrandingPanel.tsx` - Theme editing UI

---

*Last updated: December 2024*
*Version: 1.0*
