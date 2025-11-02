# Afya Sites

Site Builder and Renderer for Afya platform.

## Overview

This repository contains the site builder and renderer components that were extracted from the main Afya platform. It provides:

- **Site Builder**: React components for building and editing sites
- **Site Renderer**: Components for rendering public sites
- **Shared Types**: TypeScript definitions for site configurations

## Structure

```
src/
├── builder/          # Site builder components
├── renderer/         # Site renderer components  
├── shared/           # Shared types and utilities
└── index.ts          # Main export file
```

## Development

```bash
npm install
npm run dev          # Start development servers
npm run build        # Build for production
npm test            # Run tests
```

## Usage

### As NPM Package

```bash
npm install @afya/sites
```

```typescript
import { SiteBuilder, SiteRenderer } from '@afya/sites'
```

### As Static Bundle

The build process creates static bundles that can be served from any CDN or static hosting service.

## API

### Site Builder

- `BuilderProvider` - Context provider for builder state
- `BuilderShell` - Top navigation and controls
- `SectionManager` - Section management interface
- `PreviewPane` - Live preview of the site with draft name management
- `VersionHistoryPanel` - Advanced version history browser with preview and restore functionality

### Site Renderer

- `SectionRenderer` - Renders site sections
- `SiteHeader` - Site header component
- Individual section components (Hero, ContentBlock, etc.)

## Configuration

Site configurations are defined using the `SiteConfig` type:

```typescript
interface SiteConfig {
  theme: SiteTheme
  sections: SiteSection[]
  // ... other properties
}
```

## Key Features

### Version History System
- **Complete Version Tracking**: Automatic versioning of all draft changes with hash-based deduplication
- **Visual Version Browser**: Intuitive flyout UI with comprehensive metadata and visual indicators
- **Seamless Restore**: One-click restore to any version without page refresh
- **Autosave Protection**: Smart conflict prevention during restore operations
- **Smart Version Display**: Enhanced version notes with draft names and relative timestamps

### Draft Management
- **Draft Names**: Give meaningful names to drafts for better organization
- **Auto-Save Integration**: Draft names are automatically saved with version history
- **Contextual Placement**: Draft name input positioned in preview controls for easy access
- **Backward Compatibility**: Works seamlessly with existing drafts

### Enhanced UI/UX
- **Contextual Controls**: Version history and draft management integrated into preview pane
- **Visual Hierarchy**: Clear badges (Current/Live) and metadata display
- **Responsive Design**: Optimized for different screen sizes and workflows
- **Inline Styles**: Next.js compatible styling without CSS Modules restrictions

## Publishing

This package is published to npm and can be consumed by the main Afya platform for site building and rendering functionality.
