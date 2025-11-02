# Draft Management System

## Overview

The Draft Management System provides a comprehensive solution for organizing, naming, and managing site drafts within the Afya Sites platform. It integrates seamlessly with the version history system to provide a complete content management experience.

## Features

### 🏷️ **Draft Naming**
- **Contextual Input**: Draft name field positioned in preview controls for easy access
- **Auto-Save**: Names automatically saved with draft changes
- **Version Integration**: Names appear prominently in version history
- **Flexible Storage**: Stored in `draft.meta.draftName` without requiring database migrations

### 📝 **Enhanced Organization**
- **Meaningful Identification**: Replace generic timestamps with descriptive names
- **Visual Hierarchy**: Draft names displayed prominently in version history
- **Backward Compatibility**: Works with existing drafts that don't have names
- **Fallback Handling**: Graceful fallback to timestamp format when no name provided

### 🔄 **Seamless Integration**
- **Builder Context**: Integrated with `BuilderProvider` for state management
- **Version History**: Names automatically included in version metadata
- **API Consistency**: Consistent data structure across all endpoints
- **Real-time Updates**: Changes reflected immediately in UI

## User Interface

### Draft Name Input
**Location**: Preview Pane controls, between "Preview Full Page" button and device toggles

**Features**:
- Clean, compact input field
- Placeholder text: "My Website"
- Auto-save on change
- 140px width for optimal layout
- Consistent styling with other controls

**Layout**:
```
[🔍 Preview Full Page] [Draft Name: ________] [Desktop|Mobile] [📋] [Draft|Published]
```

### Version History Display
**Enhanced Format**:
- **With Draft Name**: "**My Website** - Sep 29, 2025 at 2:30 PM"
- **Without Draft Name**: "Version from Sep 29, 2025 at 2:30 PM"

**Visual Treatment**:
- Draft names displayed in bold
- Timestamp in smaller, muted text
- Consistent spacing and alignment
- Clear visual hierarchy

## Technical Implementation

### Data Structure

#### Draft Configuration
```json
{
  "version": "1.0",
  "business_id": "uuid",
  "theme": { ... },
  "sections": [ ... ],
  "meta": {
    "draftName": "My Website",
    "lastModified": "2025-09-29T14:30:00Z",
    "author": "user-id"
  }
}
```

#### Version Metadata
```json
{
  "id": "version-uuid",
  "note": "My Website - Sep 29, 2025 at 2:30 PM",
  "draft_name": "My Website",
  "date_created": "2025-09-29T14:30:00Z",
  "is_current": true,
  "is_published": false
}
```

### Builder Context Integration

#### updateDraft Function
```typescript
updateDraft: (patch: Partial<SiteConfig>) => {
  setDraft(prev => {
    if (!prev) {
      return {
        version: '1.0',
        business_id: businessId,
        theme: DEFAULT_THEME,
        sections: [],
        ...patch
      }
    }
    return { ...prev, ...patch }
  })
}
```

#### Usage Example
```typescript
// Update draft name
updateDraft({ 
  meta: { 
    ...draft?.meta, 
    draftName: 'New Website Name' 
  } 
})
```

### Backend Processing

#### Version Note Generation
```python
def generate_version_note(version_data, created_date):
    draft_name = version_data.get('meta', {}).get('draftName', '')
    default_note = f"Version from {created_date.strftime('%b %d, %Y at %I:%M %p')}"
    
    if draft_name:
        return f"{draft_name} - {default_note}"
    
    return default_note
```

#### API Response Enhancement
```python
version_info = {
    "id": str(version.id),
    "note": version.note or generate_version_note(version_data, version.date_created),
    "draft_name": draft_name,
    "date_created": version.date_created.isoformat(),
    # ... other fields
}
```

## Usage Guide

### For Users

#### Setting Draft Names
1. **Access**: Look for "Draft Name" field in preview controls
2. **Input**: Click and type a descriptive name
3. **Save**: Name saves automatically as you type
4. **View**: Check version history to see named versions

#### Best Practices
- **Be Descriptive**: Use names that clearly identify the draft's purpose
- **Stay Consistent**: Develop a naming convention for your team
- **Update Regularly**: Change names as drafts evolve
- **Use Context**: Include project phase, client name, or feature focus

#### Example Names
- "Homepage Redesign v1"
- "Client Review Draft"
- "Mobile Optimization"
- "Holiday Campaign Landing"
- "A/B Test Variant B"

### For Developers

#### Accessing Draft Names
```typescript
const { draft, updateDraft } = useBuilder()
const draftName = draft?.meta?.draftName || ''

// Update draft name
const handleNameChange = (newName: string) => {
  updateDraft({ 
    meta: { 
      ...draft?.meta, 
      draftName: newName 
    } 
  })
}
```

#### Custom Draft Metadata
```typescript
// Add custom metadata alongside draft name
updateDraft({
  meta: {
    ...draft?.meta,
    draftName: 'My Draft',
    author: 'user-id',
    tags: ['important', 'reviewed'],
    lastReviewed: new Date().toISOString()
  }
})
```

## Integration Points

### Version History System
- Draft names automatically included in version metadata
- Enhanced version notes with name + timestamp format
- Consistent display across all version history interfaces
- Proper fallback handling for unnamed versions

### Builder Provider
- `updateDraft` function available in all builder components
- Automatic save integration with existing draft persistence
- State management for real-time UI updates
- Type safety with TypeScript interfaces

### API Endpoints
- Draft names included in all draft-related API responses
- Consistent data structure across GET/POST/PUT operations
- Backward compatibility with existing API consumers
- Proper validation and sanitization

## Configuration Options

### Input Field Customization
```typescript
interface DraftNameInputProps {
  placeholder?: string
  maxLength?: number
  width?: string
  autoSave?: boolean
  debounceMs?: number
}
```

### Display Format Options
```typescript
interface VersionDisplayOptions {
  showDraftName?: boolean
  showTimestamp?: boolean
  dateFormat?: 'short' | 'long' | 'relative'
  nameFormat?: 'bold' | 'italic' | 'normal'
}
```

## Performance Considerations

### Auto-Save Optimization
- **Debouncing**: 500ms delay to prevent excessive API calls
- **Change Detection**: Only save when name actually changes
- **Local Storage**: Immediate local persistence with background sync
- **Error Handling**: Retry logic for failed saves

### Memory Management
- **Efficient Updates**: Shallow merging for metadata updates
- **State Cleanup**: Proper cleanup on component unmount
- **Cache Management**: Intelligent caching of draft metadata
- **Garbage Collection**: Automatic cleanup of unused references

## Security Considerations

### Input Validation
- **Length Limits**: Maximum 100 characters for draft names
- **Character Filtering**: Sanitize special characters and HTML
- **XSS Prevention**: Proper escaping in display contexts
- **SQL Injection**: Parameterized queries for database operations

### Access Control
- **User Permissions**: Verify user can edit the specific draft
- **Business Scope**: Ensure draft belongs to user's business
- **Rate Limiting**: Prevent abuse of auto-save functionality
- **Audit Logging**: Track draft name changes for compliance

## Troubleshooting

### Common Issues

**Draft Name Not Saving**
```typescript
// Check if updateDraft is available
if (!updateDraft) {
  console.error('updateDraft function not available in context')
  return
}

// Verify draft structure
if (!draft?.meta) {
  console.warn('Draft meta object not initialized')
}
```

**Names Not Appearing in Version History**
- Verify backend API includes `draft_name` in response
- Check version generation logic includes metadata
- Ensure frontend properly displays enhanced notes
- Clear browser cache and reload

**Auto-Save Issues**
- Check network connectivity
- Verify API endpoints are responding
- Look for JavaScript errors in console
- Test with manual save operations

### Debug Tools
```typescript
// Debug draft state
console.log('Current draft:', draft)
console.log('Draft name:', draft?.meta?.draftName)

// Test updateDraft function
updateDraft({ meta: { ...draft?.meta, draftName: 'Test Name' } })
```

## Future Enhancements

### Planned Features
- **Name Templates**: Predefined naming patterns
- **Auto-Naming**: AI-generated names based on content
- **Name History**: Track name changes over time
- **Bulk Rename**: Update multiple draft names at once
- **Name Validation**: Custom validation rules
- **Collaboration**: Multi-user name editing

### Advanced Metadata
- **Tags**: Categorization system
- **Descriptions**: Longer form descriptions
- **Status**: Draft status tracking (WIP, Review, Approved)
- **Priority**: Importance levels
- **Due Dates**: Deadline tracking
- **Assignments**: User assignments

## Related Documentation

- [Version History System](./VERSION_HISTORY_SYSTEM.md)
- [Builder Components](./BUILDER_COMPONENTS.md)
- [API Reference](./API_REFERENCE.md)
- [Theme System](./THEME_QUICK_REFERENCE.md)
