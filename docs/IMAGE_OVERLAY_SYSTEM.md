# Image Overlay System

## Overview

The image overlay system provides intelligent text-over-image solutions inspired by modern web design practices (like those seen on Barrio13.fit). It automatically enhances text readability by applying various overlay effects to background images and media elements.

## Features

### ✅ **Multiple Overlay Types**
- **Dark Overlay**: Semi-transparent black layer for light text
- **Light Overlay**: Semi-transparent white layer for dark text  
- **Gradient Overlay**: Directional gradients for natural shadowing
- **Blur Effect**: Frosted glass effect with backdrop blur
- **Brand Tint**: Subtle brand color overlay for cohesive theming
- **No Overlay**: Disable overlays completely

### ✅ **Intensity Controls**
- **Light**: Subtle effect (20-30% opacity)
- **Medium**: Balanced effect (35-50% opacity) - Default
- **Heavy**: Strong effect (50-60% opacity)

### ✅ **Smart Text Color Recommendations**
- Automatically suggests optimal text colors based on overlay type
- White text for dark/gradient/brand overlays
- Dark text for light/blur overlays
- Maintains accessibility standards

### ✅ **Gradient Directions**
- **From Top**: Natural header shadowing
- **From Bottom**: Classic footer shadowing  
- **From Left/Right**: Side-based gradients
- **Radial Center**: Spotlight effect from center

### ✅ **Quick Presets**
- **No Overlay**: Complete transparency
- **Subtle Dark**: Light darkening for readability
- **Classic Dark**: Standard dark overlay
- **Dramatic Dark**: Heavy overlay for maximum contrast
- **Bottom Gradient**: Natural bottom shadowing
- **Modern Blur**: Contemporary frosted glass effect
- **Brand Tint**: Cohesive brand color overlay

## Implementation

### **Hero Sections**
Image overlays are applied to Hero sections with background images:

```typescript
// Hero section with overlay
const heroSection: HeroSection = {
  type: 'hero',
  title: 'Welcome to Our Gym',
  subtitle: 'Transform your body and mind',
  backgroundImageUrl: 'https://example.com/gym-bg.jpg',
  imageOverlay: {
    type: 'gradient',
    intensity: 'medium',
    gradientDirection: 'bottom'
  }
}
```

### **ContentBlock Media**
Media items in ContentBlocks can have text overlays:

```typescript
// ContentBlock with text overlay on media
const contentBlock: ContentBlockSection = {
  type: 'content_block',
  title: 'Our Programs',
  media: [{
    url: 'https://example.com/program.jpg',
    alt: 'CrossFit Program',
    textOverlay: {
      text: 'CrossFit Unlimited',
      overlay: {
        type: 'dark',
        intensity: 'medium'
      }
    }
  }]
}
```

## Editor Interface

### **Hero Overlay Controls**
When a Hero section has a background image, the editor displays:

1. **Overlay Type Dropdown**
   - None, Dark, Light, Gradient, Blur Effect, Brand Tint

2. **Intensity Selector** (when overlay is active)
   - Light, Medium, Heavy

3. **Gradient Direction** (for gradient overlays)
   - From Top, From Bottom, From Left, From Right, Radial Center

4. **Quick Preset Buttons**
   - One-click application of common overlay combinations

### **Visual Feedback**
- Overlay controls only appear when background image is present
- Real-time preview of overlay changes
- Preset buttons highlight when active
- Tooltips provide guidance for each option

## Technical Architecture

### **CSS Generation**
Overlays are generated using dynamic CSS:

```css
/* Dark overlay example */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

/* Gradient overlay example */  
.overlay {
  background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%);
}

/* Blur overlay example */
.overlay {
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.2);
}
```

### **Text Color Intelligence**
The system automatically recommends text colors:

```typescript
const textColor = getRecommendedTextColor({
  type: 'dark',
  intensity: 'medium'
}); // Returns '#ffffff'
```

### **Responsive Behavior**
- Overlays scale appropriately on mobile devices
- Text shadows provide additional contrast on all screen sizes
- Blur effects degrade gracefully on older browsers

## Theme Versioning Impact

### ✅ **Fully Backward Compatible**
- **No theme version bump required** - purely additive feature
- **Existing Hero sections** without overlays work identically
- **Default behavior** applies subtle dark overlay to new background images
- **Progressive enhancement** - overlays enhance but don't break existing designs

### **Migration Strategy**
1. **Existing sites**: Continue working without any changes
2. **New Hero sections**: Get subtle default overlay for better text readability
3. **Manual upgrades**: Users can customize overlays via editor controls

## Files Added/Modified

### **New Files**
- `src/renderer/utils/imageOverlays.ts` - Core overlay generation logic
- `docs/IMAGE_OVERLAY_SYSTEM.md` - This documentation

### **Enhanced Components**
- `src/renderer/components/sections/Hero.tsx` - Hero overlay rendering
- `src/renderer/components/sections/ContentBlock.tsx` - Media text overlays
- `src/builder/InlineEditors/HeroEditor.tsx` - Overlay editor controls

### **Type Definitions**
- `src/renderer/types.ts` - Added `imageOverlay` to `HeroSection` and `textOverlay` to `MediaItem`

## Best Practices

### **Content Guidelines**

1. **High Contrast Images**: Use subtle overlays (light intensity)
2. **Busy Background Images**: Use medium to heavy overlays
3. **Brand-Heavy Images**: Consider brand tint for cohesion
4. **Modern Aesthetics**: Blur effects work well for contemporary designs
5. **Text Length**: Longer text needs stronger overlays for readability

### **Accessibility**

- Overlays ensure minimum 4.5:1 contrast ratio for text
- Text shadows provide additional contrast backup
- Automatic color recommendations follow WCAG guidelines
- Fallback text colors maintain readability

### **Performance**

- CSS-based overlays have minimal performance impact
- Blur effects use hardware-accelerated `backdrop-filter`
- No external dependencies or image processing required
- Overlays render instantly without loading delays

## Overlay Type Reference

| Type | Best For | Text Color | Intensity Range |
|------|----------|------------|-----------------|
| **Dark** | Light backgrounds, general use | White | Light → Heavy |
| **Light** | Dark backgrounds | Dark Gray/Black | Light → Heavy |
| **Gradient** | Natural shadowing effect | White | Light → Heavy |
| **Blur** | Modern, clean aesthetic | Dark Gray | Light → Heavy |
| **Brand** | Brand consistency | White | Light → Heavy |
| **None** | High contrast images | Auto-detected | N/A |

## Future Enhancements

### **Potential Additions**
1. **Custom gradient colors** - User-defined gradient combinations
2. **Image analysis** - Automatic overlay recommendation based on image content
3. **Advanced blur** - Selective blur areas (top/bottom only)
4. **Pattern overlays** - Subtle geometric patterns for texture
5. **Animation effects** - Subtle overlay transitions on hover

### **AI Integration**
The overlay system is designed to work with future AI features:
- **Smart recommendations** based on image analysis
- **Brand-aware suggestions** using business type and industry
- **A/B testing integration** for optimal overlay selection
- **Accessibility optimization** ensuring perfect contrast ratios

---

This overlay system provides a professional foundation for text-over-image designs while maintaining full backward compatibility and ease of use.
