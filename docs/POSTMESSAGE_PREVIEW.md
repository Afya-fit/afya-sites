# PostMessage Preview Architecture

## Overview

The site builder now uses a **postMessage-based architecture** for the inline preview, providing bulletproof rendering that matches production exactly while maintaining real-time editing capabilities.

## Architecture

### Components

1. **PreviewPane** (`/src/builder/PreviewPane.tsx`)
   - Main preview container in the site builder
   - Creates iframe pointing to dedicated preview page
   - Handles postMessage communication with iframe
   - Manages real-time updates (config, device, section selection)

2. **IframePreview** (`/pages/sites/iframe-preview/[businessId].tsx`)
   - Dedicated Next.js page that runs inside the iframe
   - Renders site using production-identical `SectionRenderer` + `BrandThemeProvider`
   - Listens for postMessage updates from parent builder
   - Provides isolated context that prevents builder UI interference

### Communication Protocol

#### Messages from Builder → Iframe

| Message Type | Payload | Description |
|--------------|---------|-------------|
| `UPDATE_CONFIG` | `{ config: SiteConfig }` | Send updated site configuration |
| `UPDATE_DEVICE` | `{ device: 'desktop' \| 'mobile' }` | Change device simulation |
| `SELECT_SECTION` | `{ index: number }` | Highlight and scroll to section |
| `PING` | `{}` | Health check |

#### Messages from Iframe → Builder

| Message Type | Payload | Description |
|--------------|---------|-------------|
| `IFRAME_READY` | `{}` | Iframe loaded and ready for communication |
| `PONG` | `{}` | Health check response |

## Benefits

### ✅ **Production Parity**
- Uses exact same rendering components as published sites
- No CSS cascade issues or context isolation problems
- Identical font rendering, responsive behavior, and layout

### ✅ **Real-Time Updates**
- Config changes update instantly without page reload
- Device switching works immediately
- Section selection with smooth scrolling
- Theme changes apply in real-time

### ✅ **Bulletproof Mobile Simulation**
- True iframe viewport creates proper mobile context
- CSS media queries work correctly
- `vw`/`vh` units behave as expected
- No interference from builder UI styles

### ✅ **Performance**
- Only sends config updates when actually changed
- Efficient postMessage communication
- No DOM manipulation across iframe boundaries
- Proper loading states and error handling

## Security

- **Same-origin policy**: Only accepts messages from same origin
- **Sandboxed iframe**: Uses `sandbox="allow-same-origin allow-scripts allow-forms"`
- **Message validation**: Validates message structure and types
- **Error boundaries**: Graceful handling of communication failures

## Development

### Debug Information

In development mode, the iframe shows debug info:
```
Iframe Preview | Device: mobile | Sections: 4 | Selected: 2
```

### Console Logging

Both components log communication events:
```
[PreviewPane] Sending config update to iframe
[IframePreview] Received config update: { theme: {...}, sections: [...] }
```

### Testing

1. **Real-time updates**: Change theme settings, add/remove sections
2. **Device switching**: Toggle between desktop/mobile views
3. **Section selection**: Click sections in builder, verify scrolling
4. **Error handling**: Test with invalid configs, network issues

## Comparison with Previous Architecture

| Aspect | Old (Direct DOM) | New (PostMessage) |
|--------|------------------|-------------------|
| **Rendering** | Custom iframe injection | Production-identical page |
| **Updates** | DOM manipulation | Message-based communication |
| **Mobile** | Simulated viewport | True iframe viewport |
| **Debugging** | Complex iframe context | Standard DevTools |
| **Reliability** | Context isolation issues | Bulletproof separation |
| **Performance** | Style copying overhead | Efficient message passing |

## Future Enhancements

1. **Bi-directional editing**: Allow editing directly in preview
2. **Performance metrics**: Track rendering performance
3. **Screenshot API**: Generate preview images
4. **A/B testing**: Compare multiple configurations
5. **Real-time collaboration**: Multi-user editing support

## Migration Notes

- **No breaking changes**: Existing builder functionality preserved
- **Automatic fallbacks**: Graceful degradation if iframe fails to load
- **Debug mode**: Development logging for troubleshooting
- **Performance**: Should be faster and more reliable than previous system

---

This architecture provides the **reliability and accuracy** needed for confident site building, eliminating the preview inconsistencies that plagued the previous system.
