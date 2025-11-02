# Changelog

All notable changes to the Afya Sites package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-09-29

### 🎉 Major Improvements - Version History System

#### Added
- **Seamless Version Restore**: Complete rewrite of restore functionality removing the need for page refreshes
- **Autosave Protection**: LocalStorage flag system prevents autosave from overwriting restored content
- **Enhanced UX**: Left-side flyout positioning covering section panel for better workflow
- **Direct Preview Mode**: Click any version to instantly preview content changes
- **Smart Error Handling**: Robust error recovery with automatic rollback on restore failures

#### Changed
- **Improved UI**: Replaced confusing ↶ icons with clear "Restore" text buttons
- **Better Visual Hierarchy**: Enhanced badges (Current/Live), metadata display, and version indicators
- **Optimized Performance**: Faster restore operations with instant UI updates
- **Cleaner Codebase**: Removed verbose debug logging for production-ready experience

#### Fixed
- **Restore Persistence**: Versions now properly "stick" after restore operations
- **Content Conflicts**: Eliminated race conditions between autosave and restore operations
- **Preview State**: Fixed preview mode persistence and exit behavior
- **Click Handling**: Improved click-outside detection for flyout dismissal

#### Technical Details
- Added `localStorage` revert flag system for autosave coordination
- Implemented `skipNextAutosaveRef` to prevent content overwrites
- Enhanced error boundaries and user feedback
- Improved TypeScript types and interfaces

### 🔧 Minor Improvements

#### Enhanced
- **Version Metadata**: More comprehensive version information display
- **Loading States**: Better loading indicators and error messages
- **Responsive Design**: Improved mobile and tablet experience
- **Accessibility**: Better keyboard navigation and screen reader support

## [1.0.2] - Previous Release

### Added
- Basic version history functionality
- Draft name management
- Initial restore capabilities

## [1.0.1] - Initial Release

### Added
- Site Builder components
- Site Renderer components
- Basic preview functionality
- Theme system integration

---

## Upcoming Features

### 🔮 Next Release (1.1.0)
- **Version Comparison**: Side-by-side diff view between versions
- **Enhanced Labeling**: User-created named snapshots beyond draft names
- **Smart Autosave**: Cadence-based saving (30s idle, significant changes)
- **Bulk Operations**: Delete multiple versions at once

### 🚀 Future Releases
- **Advanced Filtering**: Search and filter versions by content, date, author
- **Collaboration Features**: Multi-user version tracking and permissions
- **Export/Import**: Version backup and restore capabilities
- **Analytics**: Version usage statistics and insights
