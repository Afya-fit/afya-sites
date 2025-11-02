# One-Path Styling Framework

> **The single source of truth for Site Builder styling architecture, rules, and implementation patterns.**

## 🎯 Overview

The One-Path Styling Framework eliminates style conflicts by enforcing **exactly one way** to style components: CSS variables flowing through a strict 3-layer hierarchy.

### Architecture: 3 Layers Only

```
1. Section Variables (Highest Priority)
   ↓ Set on <SectionBox> wrapper
   
2. Theme Variables (Middle Priority)  
   ↓ Set by BrandThemeProvider on document root
   
3. Token Fallbacks (Lowest Priority)
   ↓ Hardcoded defaults in tokens.css
```

**Nothing else.** No inline property styles, no dynamic CSS generation, no specificity wars.

---

## 🚫 Golden Rules

### Rule 1: Only CSS Variables in Inline Styles
```tsx
// ✅ ALLOWED: CSS custom properties only
<SectionBox vars={{ '--sb-hero-bg': `url(${imageUrl})` }}>

// ❌ FORBIDDEN: Direct property styles
<div style={{ fontSize: '24px', color: 'red' }}>
```

### Rule 2: All Sections Use SectionBox
```tsx
// ✅ CORRECT: Wrapped in SectionBox
export function Hero({ section }) {
  const vars = varsForHero(section);
  return (
    <SectionBox id={section.id} type="hero" vars={vars}>
      <div className={styles.hero}>...</div>
    </SectionBox>
  );
}

// ❌ INCORRECT: Direct section rendering
export function Hero({ section }) {
  return <div className={styles.hero}>...</div>;
}
```

### Rule 3: Props Mapped via varsFor Functions
```tsx
// ✅ CORRECT: Props → Variables mapping
function varsForHero(section: HeroSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  if (section.align === 'center') {
    vars['--sb-hero-text-align'] = 'center';
  }
  
  if (section.backgroundImageUrl) {
    vars['--sb-hero-bg'] = `url("${section.backgroundImageUrl}")`;
  }
  
  return vars;
}

// ❌ INCORRECT: Direct prop usage in JSX
<div style={{ textAlign: section.align }}>
```

### Rule 4: CSS Reads Variables with Fallbacks
```css
/* ✅ CORRECT: Variable cascade with fallbacks */
.heroTitle {
  font-size: var(--sb-hero-fs, var(--sb-fs-display, 48px));
  color: var(--sb-hero-title-color, var(--sb-color-text));
}

/* ❌ INCORRECT: Hardcoded values */
.heroTitle {
  font-size: 48px;
  color: #333;
}
```

---

## 📁 File Structure

```
src/renderer/
├── theme/
│   ├── tokens.css              # Design token fallbacks
│   ├── palettes.ts             # Brand color palettes
│   ├── typography.ts           # Font presets & scales
│   └── BrandThemeProvider.tsx  # Theme → CSS variables
├── components/
│   ├── SectionBox.tsx          # Section wrapper component
│   └── sections/
│       ├── hero/
│       │   ├── Hero.tsx
│       │   ├── hero.module.css
│       │   └── index.ts
│       ├── content-block/
│       │   ├── ContentBlock.tsx
│       │   ├── contentBlock.module.css
│       │   └── index.ts
│       └── ...
└── utils/
    ├── mapSectionVars.ts       # Props → Variables mapping
    └── media.css               # Shared media utilities
```

---

## 🎨 CSS Variable Naming Convention

### Section Variables (Highest Priority)
**Pattern**: `--sb-[section]-[element]-[property]`

```css
--sb-hero-title-color        /* Hero title color */
--sb-hero-bg-image          /* Hero background image */
--sb-cb-layout-grid         /* ContentBlock layout */
--sb-schedule-spacing       /* Schedule section spacing */
```

### Theme Variables (Middle Priority)
**Pattern**: `--sb-[system]-[variant]`

```css
--sb-color-brand            /* Primary brand color */
--sb-fs-display             /* Display font size */
--sb-font-heading           /* Heading font family */
--sb-space-section          /* Section spacing */
```

### Token Fallbacks (Lowest Priority)
**Pattern**: `--sb-[token]-[size/variant]`

```css
--sb-color-text: #1f2937;   /* Default text color */
--sb-fs-body: 16px;         /* Default body font size */
--sb-space-4: 32px;         /* Default spacing unit */
```

---

## 🔧 Implementation Patterns

### Adding a New Section

1. **Create section folder**:
   ```
   src/renderer/components/sections/my-section/
   ├── MySection.tsx
   ├── mySection.module.css
   └── index.ts
   ```

2. **Create component with SectionBox**:
   ```tsx
   import { SectionBox } from '../../SectionBox';
   import { varsForMySection } from '../../../utils/mapSectionVars';
   import styles from './mySection.module.css';
   
   export function MySection({ section }: { section: MySectionType }) {
     const vars = varsForMySection(section);
     
     return (
       <SectionBox id={section.id} type="my_section" vars={vars}>
         <div className={styles.section}>
           {/* Section content */}
         </div>
       </SectionBox>
     );
   }
   
   // Required: Framework participation flag
   (MySection as any).usesFramework = true;
   ```

3. **Create CSS module with variables**:
   ```css
   /* mySection.module.css */
   .section {
     padding: var(--sb-my-section-padding, var(--sb-space-section));
     background: var(--sb-my-section-bg, var(--sb-color-surface));
     color: var(--sb-my-section-text, var(--sb-color-text));
   }
   
   .title {
     font-size: var(--sb-my-section-title-fs, var(--sb-fs-display));
     color: var(--sb-my-section-title-color, inherit);
   }
   ```

4. **Add props mapping**:
   ```tsx
   // In utils/mapSectionVars.ts
   export function varsForMySection(section: MySectionType): Record<string, string> {
     const vars: Record<string, string> = {};
     
     if (section.background === 'alt') {
       vars['--sb-my-section-bg'] = 'var(--sb-color-surface-alt)';
     }
     
     if (section.titleEmphasis) {
       vars['--sb-my-section-title-color'] = 'var(--sb-color-brand)';
     }
     
     return vars;
   }
   ```

### Typography Override Support

```tsx
// Apply typography overrides in varsFor function
function applyTypographyOverride(vars: Record<string,string>, override?: TypographyOverride) {
  if (!override) return vars;
  
  const displayMultipliers = { compact: 0.85, standard: 1, expressive: 1.15, dramatic: 1.3 };
  const textMultipliers = { compact: 0.9, standard: 1, comfortable: 1.1 };
  
  if (override.displayScale) {
    vars['--sb-title-mult'] = String(displayMultipliers[override.displayScale]);
  }
  
  if (override.customScaling?.title) {
    vars['--sb-title-mult'] = String(override.customScaling.title);
  }
  
  return vars;
}
```

### Adaptive Title Scaling

```tsx
// Character-length based scaling
function getAdaptiveTitleMultiplier(text: string, enabled: boolean): number {
  if (!enabled || !text) return 1;
  
  const length = text.length;
  if (length > 80) return 0.8;   // Very long titles
  if (length > 50) return 0.9;   // Long titles  
  if (length < 15) return 1.1;   // Short titles
  return 1;                      // Standard length
}

// Usage in varsFor function
if (section.title && theme.adaptiveTitles) {
  const multiplier = getAdaptiveTitleMultiplier(section.title, true);
  vars['--sb-title-adaptive-mult'] = String(multiplier);
}
```

---

## 🐛 Debugging Style Issues

### Step-by-Step Debug Process

1. **Check Section Variables**
   - Open browser dev tools
   - Find the `<section data-sb-section="...">` element
   - Look at "Styles" panel for `--sb-[section]-*` variables

2. **Check Theme Variables**  
   - Find `document.documentElement` in dev tools
   - Look for `--sb-color-*`, `--sb-fs-*`, `--sb-font-*` variables

3. **Check Token Fallbacks**
   - View CSS source for `tokens.css`
   - Verify hardcoded fallback values

4. **Check Console Warnings**
   - Look for `[SB] Unmapped prop...` warnings
   - Look for `[SB] Section missing usesFramework` warnings

5. **Verify CSS Cascade**
   - Use "Computed" tab in dev tools
   - See which variable value "won" the cascade

### Common Issues & Solutions

| **Issue** | **Cause** | **Solution** |
|-----------|-----------|--------------|
| Style not applying | Variable not set | Check varsFor function mapping |
| Wrong color in dark mode | Hardcoded color value | Use theme color variables |
| Font not changing | Missing font import | Check typography.ts presets |
| Layout breaking | Inline property style | Convert to CSS variable |
| Build failing | Missing usesFramework | Add export flag to component |

---

## 📋 PR Checklist

### Before Submitting

- [ ] **Section Structure**
  - [ ] Component in `components/sections/[name]/` folder
  - [ ] CSS module with `.module.css` extension
  - [ ] `index.ts` export file

- [ ] **Framework Compliance**
  - [ ] Component wrapped in `<SectionBox>`
  - [ ] Props mapped via `varsFor[Name]()` function
  - [ ] Component exports `usesFramework = true`
  - [ ] No inline property styles (only `--sb-*` CSS variables)

- [ ] **CSS Quality**
  - [ ] All properties use `var()` with fallbacks
  - [ ] No hardcoded colors/fonts/sizes
  - [ ] No `!important` declarations
  - [ ] Works in both light and dark mode

- [ ] **Testing**
  - [ ] Component renders without errors
  - [ ] Theme changes propagate correctly
  - [ ] Typography overrides work (if applicable)
  - [ ] ESLint/Stylelint clean

- [ ] **Documentation**
  - [ ] Props documented with TypeScript
  - [ ] CSS variables documented in module
  - [ ] New configurations added to this guide

### Code Review Focus Areas

1. **No Inline Property Styles**: Only `--sb-*` CSS variables allowed
2. **Proper Variable Cascade**: Section → Theme → Token fallbacks
3. **Framework Participation**: All sections use `SectionBox` pattern
4. **Accessibility**: Proper contrast ratios, semantic markup
5. **Performance**: No unnecessary re-renders or style recalculations

---

## 📚 Examples

### Hero Section Implementation

```tsx
// Hero.tsx
import { SectionBox } from '../../SectionBox';
import { varsForHero } from '../../../utils/mapSectionVars';
import styles from './hero.module.css';

export function Hero({ section }: { section: HeroSection }) {
  const vars = varsForHero(section);
  
  return (
    <SectionBox id={section.id} type="hero" vars={vars}>
      <div className={styles.hero}>
        {section.backgroundImageUrl && (
          <>
            <div className={styles.heroBg} />
            <div className={styles.heroOverlay} />
          </>
        )}
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{section.title}</h1>
          {section.subtitle && (
            <p className={styles.heroSubtitle}>{section.subtitle}</p>
          )}
        </div>
      </div>
    </SectionBox>
  );
}

(Hero as any).usesFramework = true;
```

```css
/* hero.module.css */
.hero {
  position: relative;
  min-height: var(--sb-hero-min-height, 400px);
  display: flex;
  align-items: var(--sb-hero-valign, center);
  justify-content: var(--sb-hero-halign, flex-start);
  padding: var(--sb-space-section);
  background: var(--sb-hero-bg-color, var(--sb-color-surface));
}

.heroBg {
  position: absolute;
  inset: 0;
  background: var(--sb-hero-bg-image) var(--sb-hero-bg-position, center) / cover no-repeat;
  z-index: 1;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: var(--sb-hero-overlay, transparent);
  z-index: 2;
}

.heroContent {
  position: relative;
  z-index: 3;
  max-width: var(--sb-hero-content-width, 600px);
  text-align: var(--sb-hero-text-align, left);
}

.heroTitle {
  margin: 0 0 1rem 0;
  font-size: var(--sb-hero-title-fs, var(--sb-fs-display));
  line-height: var(--sb-hero-title-lh, var(--sb-lh-tight, 1.2));
  color: var(--sb-hero-title-color, var(--sb-color-text));
  font-weight: var(--sb-hero-title-weight, 700);
}

.heroSubtitle {
  margin: 0;
  font-size: var(--sb-hero-subtitle-fs, var(--sb-fs-title));
  line-height: var(--sb-hero-subtitle-lh, var(--sb-lh-normal, 1.4));
  color: var(--sb-hero-subtitle-color, var(--sb-color-text));
  opacity: var(--sb-hero-subtitle-opacity, 0.8);
}
```

```tsx
// In utils/mapSectionVars.ts
export function varsForHero(section: HeroSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Alignment
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  if (section.align) {
    vars['--sb-hero-halign'] = alignMap[section.align];
    vars['--sb-hero-text-align'] = section.align;
  }
  
  const valignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
  if (section.valign) {
    vars['--sb-hero-valign'] = valignMap[section.valign];
  }
  
  // Background image
  if (section.backgroundImageUrl) {
    vars['--sb-hero-bg-image'] = `url("${section.backgroundImageUrl}")`;
    
    if (section.backgroundFocal?.desktop) {
      const { xPct, yPct } = section.backgroundFocal.desktop;
      vars['--sb-hero-bg-position'] = `${xPct}% ${yPct}%`;
    }
  }
  
  // Image overlay
  if (section.imageOverlay) {
    const overlay = mapImageOverlay(section.imageOverlay);
    Object.assign(vars, overlay);
  }
  
  // Brand emphasis
  if (section.brandEmphasis) {
    vars['--sb-hero-title-color'] = 'var(--sb-color-brand)';
  }
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  return vars;
}
```

---

## 🚨 Common Pitfalls

### ❌ Don't Do This

```tsx
// Inline property styles
<div style={{ fontSize: 24, color: 'red' }}>

// Direct CSS classes with hardcoded values  
.hero { font-size: 48px; color: blue; }

// Bypassing SectionBox
export function Hero() {
  return <div className="hero">...</div>;
}

// Missing framework flag
export function Hero() { ... }
// Missing: (Hero as any).usesFramework = true;

// Props used directly in JSX
<h1 style={{ color: section.brandEmphasis ? 'blue' : 'black' }}>
```

### ✅ Do This Instead

```tsx
// CSS variables only
<SectionBox vars={{ '--sb-hero-bg': `url(${image})` }}>

// CSS with variable fallbacks
.hero { 
  font-size: var(--sb-hero-fs, var(--sb-fs-display, 48px)); 
  color: var(--sb-hero-color, var(--sb-color-text));
}

// Proper SectionBox wrapper
export function Hero({ section }) {
  const vars = varsForHero(section);
  return <SectionBox vars={vars}>...</SectionBox>;
}

// Framework participation
(Hero as any).usesFramework = true;

// Props mapped to variables
function varsForHero(section) {
  return section.brandEmphasis 
    ? { '--sb-hero-color': 'var(--sb-color-brand)' }
    : {};
}
```

---

## 📈 Performance Considerations

### CSS Variable Performance
- ✅ **Fast**: CSS variables are browser-native and highly optimized
- ✅ **Efficient**: No JavaScript calculations during render
- ✅ **Cacheable**: CSS modules benefit from build-time optimization

### Memory Usage
- ✅ **Low overhead**: Variables only created when needed
- ✅ **Garbage collected**: Unused variables are automatically cleaned up
- ✅ **Shared values**: Theme variables shared across all sections

### Bundle Size
- ✅ **Tree-shakeable**: Unused CSS modules are eliminated
- ✅ **Compressed**: Variable names minified in production
- ✅ **No runtime**: No CSS-in-JS runtime overhead

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Blur overlays**: `--sb-hero-overlay-blur` with backdrop-filter
- [ ] **Brand overlays**: `--sb-hero-overlay-brand` with brand color tints  
- [ ] **Advanced gradients**: Multi-stop gradients with custom colors
- [ ] **Animation variables**: `--sb-hero-transition-duration` for motion
- [ ] **Container queries**: Responsive variables based on section width

### Extension Points
- [ ] **Custom properties**: Site-specific CSS variable overrides
- [ ] **Plugin system**: Third-party section types
- [ ] **Design tokens**: Integration with design system tools
- [ ] **AI theming**: Automated variable generation from brand assets

---

## 📞 Getting Help

### Debugging Steps
1. Check this documentation for patterns and examples
2. Use browser dev tools to inspect CSS variables
3. Look for console warnings about unmapped props
4. Review PR checklist for common issues

### Team Resources
- **Framework questions**: Post in #frontend-architecture
- **Design tokens**: Collaborate with #design-system
- **Performance issues**: Escalate to #performance-review
- **New section types**: Template available in this guide

---

*Last updated: Implementation of One-Path Styling Framework*
*Version: 1.0*
*Maintainers: Frontend Architecture Team*
