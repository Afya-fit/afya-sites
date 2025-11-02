# Text Wrapping and Dynamic Scaling System

## Overview

The text wrapping system provides intelligent text handling for Hero and ContentBlock sections, featuring:

- **Dynamic font scaling** based on content length
- **Character limits** with visual feedback
- **Word wrapping** with overflow protection
- **Responsive typography** that adapts to mobile
- **Real-time character counting** in editors

## Features

### ✅ **Character Limits**
- **Hero Title**: 80 characters
- **Hero Subtitle**: 160 characters  
- **Content Title**: 100 characters
- **Content Body**: 600 characters

### ✅ **Line Break Support**
- **Multi-line text fields** support `\n` line breaks
- **Smart paragraph breaks** with double line breaks (`\n\n`)
- **Character counting** excludes line breaks from limits
- **Line count display** in editor (max 3 lines recommended)
- **Responsive line heights** adjust for multi-line content

### ✅ **Dynamic Font Scaling**
Text automatically scales down as content length increases:

```typescript
// Example scaling for Hero Title:
// 0-20 chars: 100% size (72px)
// 21-40 chars: 90% size (65px)
// 41-60 chars: 80% size (58px) 
// 61-80 chars: 70% size (50px)
```

### ✅ **Smart Word Wrapping**
- Uses `word-wrap: break-word` and `overflow-wrap: break-word`
- Automatic hyphenation with `hyphens: auto`
- Prevents text overflow outside sections
- Maintains readability across devices

### ✅ **Responsive Line Heights**
Line heights adjust automatically with font size:
- **Short text**: Tighter line height (1.05 for titles)
- **Long text**: More generous line height (1.2-1.35 for titles)

## Technical Implementation

### **CSS Variables**
Dynamic scaling uses CSS custom properties:

```css
.hero-title {
  font-size: var(--fs-hero-dynamic, var(--fs-hero));
  line-height: var(--lh-hero-dynamic, 1.05);
}
```

### **React Components**
```typescript
// Hero component automatically generates scaling CSS
const titleCSS = title ? generateTextScalingCSS(title, 'heroTitle') : {};
const subtitleCSS = subtitle ? generateTextScalingCSS(subtitle, 'heroSubtitle') : {};
```

### **Editor Integration**
Enhanced textarea components with character counters:

```typescript
<TextareaWithCounter
  label="Title"
  value={hero.title || ''}
  maxLength={CHARACTER_LIMITS.HERO_TITLE}
  onChange={e => updateSection(selectedIndex, { title: e.target.value })}
  helperText="Keep it short and impactful"
/>
```

## Character Counter UI

### **Visual States**
- 🟢 **Good**: 0-75% of limit (green checkmark)
- 🟡 **Warning**: 75-95% of limit (amber warning icon)
- 🔴 **Danger**: 95-100% of limit (red warning icon)
- ❌ **Over**: Above limit (red X, shows overage count)

### **Real-time Feedback**
- Character count display: "65/80"
- Remaining characters: "15 characters remaining"
- Over-limit warning: "5 characters over limit"

## Best Practices

### **Content Guidelines**
1. **Hero Titles**: Keep under 60 characters for best impact
2. **Hero Subtitles**: Use 100-140 characters for optimal readability
3. **Content Titles**: Aim for 50-80 characters
4. **Content Body**: Break up long text with paragraphs, aim for 300-500 characters per block

### **Mobile Considerations**
- Font sizes automatically reduce on smaller screens
- Line heights increase for better mobile readability
- Text wrapping prevents horizontal overflow
- Viewport units ensure proper scaling

### **Accessibility**
- Maintains minimum font sizes for readability
- Proper contrast ratios preserved
- Semantic HTML structure maintained
- Screen reader friendly

## Configuration

### **Scaling Presets**
Located in `src/renderer/utils/textScaling.ts`:

```typescript
export const TEXT_SCALING_PRESETS = {
  heroTitle: {
    baseSize: 72,
    minSize: 32,
    maxLength: 80,
    breakpoints: [
      { length: 20, scale: 1.0, lineHeight: 1.05 },
      { length: 40, scale: 0.9, lineHeight: 1.1 },
      { length: 60, scale: 0.8, lineHeight: 1.15 },
      { length: 80, scale: 0.7, lineHeight: 1.2 }
    ]
  },
  // ... other presets
}
```

### **Character Limits**
Located in `src/renderer/types.ts`:

```typescript
export const CHARACTER_LIMITS = {
  HERO_TITLE: 80,
  HERO_SUBTITLE: 160,
  CONTENT_TITLE: 100,
  CONTENT_BODY: 600,
} as const;
```

## Theme Versioning Impact

### ✅ **Backward Compatible**
Line break support is **100% backward compatible** with existing sites:

- **No theme version bump required** - this is a content rendering enhancement
- **Existing content without line breaks** renders exactly the same
- **New content with line breaks** renders properly with `<br>` tags
- **Character limits remain the same** (line breaks don't count toward limits)

### **Implementation Details**
- Uses `TextWithLineBreaks` component wrapper
- Fallback to original text rendering if line breaks aren't detected
- Character counting excludes `\n` characters for consistent limits
- CSS line-height adjustments are applied via existing dynamic scaling system

### **No Migration Needed**
Since line break support is purely additive:
- **Existing sites**: Continue working exactly as before
- **New content**: Can optionally use line breaks for better formatting
- **Theme version**: Remains at `1.0` - no breaking changes

## Files Changed

### **Core Components**
- `src/renderer/components/sections/Hero.tsx` - Dynamic scaling integration
- `src/renderer/components/sections/ContentBlock.tsx` - Dynamic scaling integration
- `src/renderer/theme/BrandThemeProvider.tsx` - CSS for text wrapping and scaling

### **Utilities**
- `src/renderer/utils/textScaling.ts` - Text scaling calculations and utilities
- `src/renderer/utils/textRendering.tsx` - **NEW**: Line break rendering and text processing
- `src/renderer/types.ts` - Character limits and type definitions

### **Editor Components**
- `src/builder/components/CharacterCounter.tsx` - Character counter UI component
- `src/builder/InlineEditors/HeroEditor.tsx` - Enhanced with character counters
- `src/builder/InlineEditors/ContentBlockEditor.tsx` - Enhanced with character counters

## Future Enhancements

### **Potential Improvements**
1. **AI-suggested text optimization** - Recommend shorter, more impactful text
2. **A/B testing integration** - Test different text lengths for conversion
3. **Multi-language support** - Different character limits for different languages
4. **Advanced typography controls** - Letter spacing, font weight adjustments
5. **Content templates** - Pre-written text suggestions for different industries

### **Performance Considerations**
- Text scaling calculations are lightweight and cached
- CSS variables minimize DOM manipulation
- Character counting is debounced for performance
- No external dependencies added

## Troubleshooting

### **Common Issues**

**Text not scaling down**:
- Check that `generateTextScalingCSS` is being called
- Verify CSS custom properties are applied to the container
- Ensure the text preset exists in `TEXT_SCALING_PRESETS`

**Character counter not showing**:
- Verify `CHARACTER_LIMITS` is imported
- Check that `TextareaWithCounter` is used instead of regular `<textarea>`
- Ensure `maxLength` prop is passed correctly

**Text overflowing**:
- Check that CSS `word-wrap: break-word` is applied
- Verify `max-width: 100%` is set on text containers
- Ensure proper responsive CSS is active

---

This system provides a robust foundation for handling variable-length text content while maintaining excellent user experience across all devices and content lengths.
