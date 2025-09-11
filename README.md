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
- `PreviewPane` - Live preview of the site

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

## Publishing

This package is published to npm and can be consumed by the main Afya platform for site building and rendering functionality.
