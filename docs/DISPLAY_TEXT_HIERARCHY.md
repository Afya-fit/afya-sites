# Display/Text Typography Hierarchy (v1.1)

## Overview

The Display/Text Typography Hierarchy is a professional typography system introduced in Theme v1.1 that separates typography into two distinct categories for better visual hierarchy and reading experience.

## Core Concepts

### 🎯 **Display Typography**
**Purpose**: Attention-grabbing, impact-focused elements
**Elements**: Hero titles, section headings, page titles
**Characteristics**: Bold, dramatic, short-form content

### 📖 **Text Typography**
**Purpose**: Reading-optimized, content-focused elements  
**Elements**: Body text, descriptions, subtitles, UI elements
**Characteristics**: Readable, comfortable, long-form content

## Scale Options

### Display Scales (Titles & Headings)

| Scale | Use Case | Hero Size | H2 Size | Description |
|-------|----------|-----------|---------|-------------|
| **Compact** | Professional, Conservative | 40-56px | 22-28px | Corporate sites, formal content |
| **Standard** | Balanced, Versatile | 48-72px | 24-36px | Most websites, general purpose |
| **Expressive** | Creative, Lifestyle | 56-84px | 28-42px | Creative agencies, portfolios |
| **Dramatic** | Bold, Statement | 64-96px | 32-48px | Events, marketing, high-impact |

### Text Scales (Body & Content)

| Scale | Use Case | Body Size | Subtitle Size | Description |
|-------|----------|-----------|---------------|-------------|
| **Compact** | Dense, Information-heavy | 14-16px | 16-18px | Dashboards, data-heavy content |
| **Standard** | Balanced, General | 16-18px | 18-22px | Most websites, standard reading |
| **Comfortable** | Spacious, Easy Reading | 17-19px | 19-24px | Blogs, articles, accessibility focus |

## Real-World Examples

### Corporate Website
```typescript
typography: {
  displayScale: 'compact',    // Professional headlines
  textScale: 'standard',      // Standard body text
  adaptiveTitles: true
}
```

### Creative Agency
```typescript
typography: {
  displayScale: 'dramatic',   // Bold, attention-grabbing
  textScale: 'comfortable',   // Easy reading for portfolios
  adaptiveTitles: true
}
```

### Blog/Content Site
```typescript
typography: {
  displayScale: 'standard',   // Balanced headlines
  textScale: 'comfortable',   // Reading-optimized content
  adaptiveTitles: true
}
```

## Adaptive Title Sizing

When `adaptiveTitles: true` (default), the system automatically adjusts font sizes based on text length:

### Hero Titles (80 char limit)
- **0-15 chars**: Full size (100% of scale)
- **16-30 chars**: Slightly smaller (90% of scale)
- **31-50 chars**: Medium reduction (80% of scale)
- **51-70 chars**: Significant reduction (70% of scale)

### Section Titles (100 char limit)
- **0-20 chars**: Full size (100% of scale)
- **21-40 chars**: Slight reduction (95% of scale)
- **41-60 chars**: Medium reduction (85% of scale)
- **61-80 chars**: Significant reduction (75% of scale)

## Section-Level Overrides (Future)

Each section can override the global typography settings:

```typescript
// Hero section with dramatic override
{
  type: 'hero',
  title: 'Special Event',
  typographyOverride: {
    displayScale: 'dramatic',        // Override global setting
    customScaling: { title: 1.2 },  // 20% larger than normal
    disableAdaptiveTitles: true      // Fixed size regardless of length
  }
}
```

## Technical Benefits

### 🎨 **Design Flexibility**
- Independent control of display vs. text elements
- Professional typography hierarchy
- Scale-specific optimization

### 📱 **Responsive by Design**
- Built-in `clamp()` functions for fluid scaling
- Mobile-optimized size ranges
- Viewport-aware responsive behavior

### ♿ **Accessibility**
- Reading-optimized text scales
- Comfortable line heights
- Dynamic scaling prevents overflow

### 🔄 **Future-Ready**
- Section-level override capability
- AI-ready typography controls
- Extensible scale system

## Migration from v1.0

The system automatically migrates v1.0 themes:

```typescript
// v1.0 (Legacy)
typography: { 
  sizeScale: 'large' 
}

// Becomes v1.1
typography: {
  displayScale: 'expressive',  // Mapped from 'large'
  textScale: 'comfortable',    // Mapped from 'large'
  adaptiveTitles: true,        // Enabled by default
  sizeScale: 'large'           // Preserved for compatibility
}
```

## Best Practices

### ✅ **Do**
- Use **Display scales** for impact and hierarchy
- Use **Text scales** for readability and comfort
- Enable **adaptive titles** for dynamic content
- Choose scales that match your brand personality

### ❌ **Don't**
- Mix display and text scaling inappropriately
- Disable adaptive titles without good reason
- Use dramatic scales for reading-heavy content
- Use compact scales for accessibility-focused sites

## Editor Experience

The enhanced BrandingPanel provides intuitive controls:

1. **Display Scale**: "Titles & Headings" - Controls visual impact
2. **Text Scale**: "Body & Content" - Controls reading comfort  
3. **Adaptive Titles**: Checkbox to enable/disable dynamic scaling

Each option includes descriptive labels and real-world use cases for easy selection.
