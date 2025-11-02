# 🔍 QA Preview System

## Overview

The QA Preview system provides a **bulletproof standalone preview** that opens in a new tab, completely separate from the builder interface. This eliminates all iframe context issues and provides true production-like behavior for quality assurance testing.

## How It Works

### Architecture
```
Builder → QA Preview Button → New Tab → Standalone Site
```

**No iframe, no wrapper, no context isolation issues.**

### Components

#### 1. Frontend Route (`/sites/preview/[businessId]`)
- **Location**: `afya-frontend/pages/sites/preview/[businessId].tsx`
- **Purpose**: Renders a completely standalone site preview
- **Features**:
  - Server-side configuration parsing and validation
  - Clean HTML document with proper viewport meta tag
  - Debug info overlay in development mode
  - Graceful error handling for invalid configurations

#### 2. QA Preview Button
- **Location**: `afya-sites/src/builder/PreviewPane.tsx` (PreviewControls component)
- **Purpose**: Opens the standalone preview in a new tab
- **Features**:
  - Encodes site configuration as URL parameter
  - Disabled state when no draft is available
  - Error handling for JSON serialization issues

## Benefits

### ✅ Eliminates Iframe Issues
- **No context isolation**: CSS variables and global state work normally
- **True viewport behavior**: Real mobile responsive behavior
- **Perfect debugging**: Normal DevTools, no iframe context switching
- **No performance overhead**: Single React app, not double rendering

### ✅ Production Parity
- **Exact same rendering**: Uses the same `BrandThemeProvider` and `SectionRenderer`
- **Real responsive behavior**: True mobile viewport, not simulated
- **Accurate font loading**: No iframe font loading timing issues
- **Proper CSS cascade**: No style conflicts or circular references

### ✅ QA Confidence
- **Shareable URLs**: Can send preview links to stakeholders
- **Reliable testing**: What you see is exactly what gets published
- **No "preview bugs"**: Eliminates false positives from iframe issues

## Usage

### For Developers
1. **Open Site Builder**: Navigate to `/sitebuilder/{businessId}`
2. **Click QA Preview**: Blue "🔍 QA Preview" button in preview controls
3. **New tab opens**: Standalone site preview with current draft configuration
4. **Test thoroughly**: Responsive behavior, theme controls, all functionality

### For QA Testing
1. **Make theme changes** in the builder
2. **Click QA Preview** to open standalone preview
3. **Test in new tab**:
   - Resize window to test responsive behavior
   - Check font sizes and typography scaling
   - Verify colors and theme application
   - Test on different devices/browsers
4. **Compare with published site** to ensure parity

## Technical Details

### URL Structure
```
/sites/preview/{businessId}?config={encodedSiteConfig}
```

### Configuration Passing
```typescript
// Site config is JSON-encoded and passed via URL parameter
const configParam = encodeURIComponent(JSON.stringify(draft));
const previewUrl = `/sites/preview/${businessId}?config=${configParam}`;
window.open(previewUrl, '_blank');
```

### Server-Side Validation
```typescript
// Server validates and normalizes configuration
const siteConfig: SiteConfig = JSON.parse(decodeURIComponent(config));
const validatedConfig = {
  version: siteConfig.version || '1.0',
  business_id: businessId,
  theme: siteConfig.theme || defaultTheme,
  sections: siteConfig.sections || []
};
```

## Development

### Debug Mode
In development, the preview shows a debug overlay with:
- Business ID
- Number of sections
- "QA Preview" label for identification

### Error Handling
- **Invalid config**: Redirects back to builder with error parameter
- **Missing business ID**: Returns 404
- **JSON parse errors**: Graceful error handling with user feedback

## Future Enhancements

### Planned Features
1. **Real-time sync**: Optional WebSocket connection for live updates
2. **Platform data integration**: Fetch real business data for preview
3. **Performance metrics**: Show preview rendering performance
4. **Screenshot API**: Generate preview screenshots for sharing

### Potential Improvements
1. **URL shortening**: Shorter preview URLs for easier sharing
2. **Preview history**: Save and revisit previous preview states
3. **A/B testing**: Compare multiple theme variations
4. **Mobile device simulation**: Specific device viewport presets

## Troubleshooting

### Common Issues

#### "No draft available for preview"
- **Cause**: Draft state is null or empty
- **Solution**: Add at least one section to the site before previewing

#### "Failed to open preview"
- **Cause**: JSON serialization error or browser popup blocker
- **Solution**: Check browser console for errors, allow popups for the domain

#### Preview doesn't match builder
- **Cause**: This should not happen with the new system
- **Solution**: If it does occur, this indicates a bug that needs investigation

### Debug Steps
1. **Check browser console** for JavaScript errors
2. **Verify URL parameters** are properly encoded
3. **Test in incognito mode** to rule out extension conflicts
4. **Compare with published site** to verify production parity

## Migration Notes

### From Iframe Preview
The QA Preview system **complements** the existing iframe preview:
- **Iframe preview**: Still used for real-time editing and section selection
- **QA preview**: Used for final validation and testing

### No Breaking Changes
- All existing functionality remains unchanged
- QA Preview is an **additional** feature, not a replacement
- Gradual migration path available for future iframe improvements

---

**The QA Preview system provides bulletproof, production-accurate previews that eliminate the recurring issues we've experienced with iframe-based previews. Use it for all final validation and QA testing.**
