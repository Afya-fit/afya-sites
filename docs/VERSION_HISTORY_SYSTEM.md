# Version History System

## Overview

The Version History System provides comprehensive version tracking and management for site drafts, allowing users to safely experiment with changes while maintaining the ability to revert to previous versions.

## Features

### 🕒 **Automatic Version Tracking**
- Every draft save creates a new version automatically
- Versions include complete site configuration (sections, theme, metadata)
- Hash-based deduplication prevents duplicate versions
- Maintains references to current and published versions

### 📋 **Visual Version Browser**
- Accessible via history button in preview controls
- Shows comprehensive metadata for each version:
  - Draft name (if provided)
  - Creation timestamp
  - Section count
  - Theme name
  - Section preview (first 3 section titles)
- Clear visual indicators for Current and Live versions
- Responsive design with proper scrolling

### ↶ **One-Click Restore**
- Restore to any previous version with confirmation dialog
- Creates new version when restoring (preserves history)
- **No page refresh required** - seamless content updates
- **Autosave protection** - prevents overwriting restored content
- Safe operation with proper error handling and rollback

### 🏷️ **Draft Name Integration**
- Draft names appear prominently in version history
- Enhanced version notes: "Draft Name - Version from Date"
- Fallback to standard timestamp format for unnamed drafts
- Stored in `draft.meta.draftName` for easy access

## Technical Implementation

### Backend API

#### Version History Endpoint
```
GET /api/sitebuilder/{businessId}/versions
```

**Response Structure:**
```json
{
  "ok": true,
  "business_id": "uuid",
  "versions": [
    {
      "id": "version-uuid",
      "note": "My Website - Sep 29, 2025 at 2:30 PM",
      "date_created": "2025-09-29T14:30:00Z",
      "sections_count": 5,
      "theme_name": "Modern",
      "draft_name": "My Website",
      "is_current": true,
      "is_published": false,
      "section_preview": ["Hero", "About Us", "Services"]
    }
  ],
  "current_version_id": "uuid",
  "published_version_id": "uuid",
  "total_versions": 10
}
```

#### Restore Endpoint
```
POST /api/sitebuilder/{businessId}/versions
```

**Request Body:**
```json
{
  "action": "revert",
  "version_id": "target-version-uuid"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Successfully reverted to selected version",
  "new_version_id": "uuid",
  "reverted_from_version_id": "uuid"
}
```

### Frontend Components

#### VersionHistoryPanel
- **Location**: `src/builder/VersionHistoryPanel.tsx`
- **Styling**: Inline styles (Next.js compatible)
- **Features**:
  - Version list with metadata and visual indicators
  - **Direct preview mode** - click any version to preview instantly
  - **Seamless restore** - restore functionality with confirmation
  - **Smart positioning** - left-side flyout covering section panel
  - Loading and error states with proper feedback
  - Responsive design with optimized scrolling

#### Integration Points
- **Preview Controls**: History button in preview pane with flyout positioning
- **Builder Context**: Full integration with `useBuilder()` including preview state
- **API Integration**: Direct calls to version history and restore endpoints
- **Autosave Integration**: Protected restore process prevents content conflicts

### Data Storage

#### Database Schema
```sql
-- SiteDraft table
CREATE TABLE sitebuilder_sitedraft (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    site_slug VARCHAR(64),
    current_version_id UUID REFERENCES sitebuilder_sitedraftversion(id),
    published_version_id UUID REFERENCES sitebuilder_sitedraftversion(id),
    date_created TIMESTAMP,
    date_updated TIMESTAMP
);

-- SiteDraftVersion table
CREATE TABLE sitebuilder_sitedraftversion (
    id UUID PRIMARY KEY,
    draft_id UUID REFERENCES sitebuilder_sitedraft(id),
    data JSONB NOT NULL,
    note VARCHAR(255),
    date_created TIMESTAMP
);
```

#### JSON Data Structure
```json
{
  "version": "1.0",
  "business_id": "uuid",
  "theme": { ... },
  "sections": [ ... ],
  "meta": {
    "draftName": "My Website"
  }
}
```

## Usage Guide

### For Users

1. **Accessing Version History**
   - Click the history button (🕒) in the preview controls
   - Panel opens on the right side of the screen

2. **Viewing Versions**
   - Scroll through the version list
   - Current version highlighted in green
   - Published version shows "Live" badge
   - Click any version to select it

3. **Restoring to Previous Version**
   - Click "Restore" button next to any version
   - Confirm the action in the dialog
   - Content updates seamlessly without page refresh

4. **Managing Draft Names**
   - Enter a name in the "Draft Name" field in preview controls
   - Names automatically save and appear in version history
   - Use descriptive names for better organization

### For Developers

#### Adding Version History to New Components
```typescript
import { VersionHistoryPanel } from '@afya/sites'

function MyBuilder() {
  const [showHistory, setShowHistory] = useState(false)
  const { businessId } = useBuilder()

  return (
    <>
      <button onClick={() => setShowHistory(true)}>
        View History
      </button>
      
      {showHistory && (
        <VersionHistoryPanel
          businessId={businessId}
          onClose={() => setShowHistory(false)}
          onVersionRevert={() => window.location.reload()}
        />
      )}
    </>
  )
}
```

#### Extending Version Metadata
```typescript
// Add custom metadata to versions
const customVersion = {
  ...standardVersion,
  customField: 'value',
  tags: ['important', 'reviewed']
}
```

## Best Practices

### Version Management
- **Meaningful Names**: Use descriptive draft names for important versions
- **Regular Saves**: Save frequently to create restore points
- **Pre-Publish Review**: Always review changes before publishing
- **Backup Strategy**: Keep important versions with clear names

### Performance Considerations
- **Pagination**: Version list is paginated for large histories
- **Lazy Loading**: Version details loaded on demand
- **Caching**: API responses cached for better performance
- **Cleanup**: Old versions can be cleaned up via admin tools

### Error Handling
- **Network Issues**: Graceful degradation with retry options
- **Invalid Versions**: Clear error messages for corrupted data
- **Permission Errors**: Proper authorization checks
- **Concurrent Edits**: Conflict resolution strategies

## Troubleshooting

### Common Issues

**Version History Not Loading**
- Check network connectivity
- Verify business ID is correct
- Ensure proper authentication
- Check browser console for errors

**Revert Not Working**
- Confirm version exists and is accessible
- Check for unsaved changes
- Verify sufficient permissions
- Try refreshing the page

**Draft Names Not Saving**
- Ensure `updateDraft` function is available in context
- Check for JavaScript errors
- Verify API endpoints are responding
- Clear browser cache if needed

### Debug Information
- Version history API calls logged to browser console
- Error states displayed in UI with actionable messages
- Network requests include proper error handling
- State changes tracked for debugging

## Recent Improvements

### ✅ **Version 2.1 - Enhanced Restore System**
- **Seamless Restore**: No page refresh required for version restores
- **Autosave Protection**: LocalStorage flag system prevents content conflicts
- **Error Recovery**: Robust error handling with automatic rollback
- **Performance**: Optimized restore process with instant UI updates

### ✅ **Version 2.0 - UX Overhaul** 
- **Smart Flyout**: Left-side positioning covering section panel
- **Direct Preview**: Click any version to preview instantly
- **Clear Actions**: "Restore" buttons instead of confusing icons
- **Visual Hierarchy**: Better badges, indicators, and metadata display

## Future Enhancements

### Planned Features
- **Version Comparison**: Side-by-side diff view
- **Enhanced Labeling**: User-created named snapshots beyond draft names
- **Smart Autosave**: Cadence-based saving (30s idle, significant changes)
- **Bulk Operations**: Delete multiple versions at once
- **Export/Import**: Version backup and restore capabilities
- **Collaboration**: Multi-user version tracking and permissions

### API Extensions
- **Search**: Full-text search across version content
- **Filtering**: Advanced filtering by date, author, tags
- **Analytics**: Version usage and restore statistics
- **Webhooks**: Integration with external systems

## Related Documentation

- [Draft Management System](./DRAFT_MANAGEMENT.md)
- [Theme System](./THEME_QUICK_REFERENCE.md)
- [API Reference](./API_REFERENCE.md)
- [Builder Components](./BUILDER_COMPONENTS.md)
