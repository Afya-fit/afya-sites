import React from 'react'
import { useBuilder } from './context/BuilderProvider'
import { isAddable } from '../renderer/sectionRegistry'
import HeroEditor from './InlineEditors/HeroEditor'
import ContentBlockEditor from './InlineEditors/ContentBlockEditor'
import BusinessDataEditor from './InlineEditors/BusinessDataEditor'
import LinksPageEditor from './InlineEditors/LinksPageEditor'
import ScheduleEditor from './InlineEditors/ScheduleEditor'
import ImageSettingsPanel from './ImageSettingsPanel'
import BrandingPanel from './BrandingPanel'
import ImageLibrary from './ImageLibrary'
import { ensureCsrfCookie, getCookie } from '../utils/api'

export default function SectionManager() {
  const { draft, view, addSection, removeSection, selectedIndex, setSelectedIndex, reorderSections, openImageManager, isPreviewMode } = useBuilder()
  const sections = draft?.sections || []
  const isViewingPublished = view === 'published'
  const isReadOnlyMode = isViewingPublished || isPreviewMode
  const hasLinks = sections.some(s => s.type === 'links_page')
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [dropIndex, setDropIndex] = React.useState<number | null>(null)
  const [dropAtEnd, setDropAtEnd] = React.useState<boolean>(false)
  const [activeTab, setActiveTab] = React.useState<'sections' | 'branding' | 'media'>('sections')

  const handleDropReorder = (fromIndex: number, toIndex: number) => {
    if (!Array.isArray(sections) || fromIndex === toIndex) return
    // Prevent dragging the links_page and prevent dropping into index 0
    const fromItem = sections[fromIndex]
    if (!fromItem || fromItem.type === 'links_page') return
    const safeToIndex = Math.max(1, toIndex)
    const next = [...sections]
    const [moved] = next.splice(fromIndex, 1)
    // Adjust index if removing before insertion point
    const adjustedIndex = fromIndex < safeToIndex ? safeToIndex - 1 : safeToIndex
    next.splice(adjustedIndex, 0, moved)
    // Enforce links_page stays at top if present
    const linkIdx = next.findIndex(s => s.type === 'links_page')
    if (linkIdx > 0) {
      const [link] = next.splice(linkIdx, 1)
      next.unshift(link)
    }
    reorderSections(next as any)
  }
  return (
    <div style={{ 
      marginTop: 12, 
      border: '1px solid var(--sb-color-border)', 
      borderRadius: 8, 
      overflow: 'hidden',
      position: 'relative',
      opacity: isReadOnlyMode ? 0.7 : 1,
      pointerEvents: isReadOnlyMode ? 'none' : 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 12px', background: '#fff', borderBottom: '1px solid var(--sb-color-border)' }}>
        <button 
          onClick={() => setActiveTab('sections')} 
          style={{ 
            padding: '6px 10px', 
            borderRadius: 6, 
            border: '1px solid var(--sb-color-border)',
            background: activeTab === 'sections' ? '#eee' : '#fff'
          }}
        >
          Sections
        </button>
        <button 
          onClick={() => setActiveTab('branding')} 
          style={{ 
            padding: '6px 10px', 
            borderRadius: 6, 
            border: '1px solid var(--sb-color-border)',
            background: activeTab === 'branding' ? '#eee' : '#fff'
          }}
        >
          Branding
        </button>
        <button
          onClick={() => setActiveTab('media')} 
          style={{ 
            padding: '6px 10px', 
            borderRadius: 6, 
            border: '1px solid var(--sb-color-border)',
            background: activeTab === 'media' ? '#eee' : '#fff'
          }}
        >
          Media
        </button>
      </div>
      <div style={{ padding: 12 }}>
        {activeTab === 'sections' && (
          <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <strong>Sections</strong>
        <AddSectionDropdown />
      </div>
      {sections.length === 0 ? (
        <div style={{ marginTop: 8, opacity: .7 }}>No sections yet. Click "Add Section" to start.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
          {sections.map((s, i) => (
            <li
              key={i}
              draggable={s.type !== 'links_page'}
              onDragStart={(e) => {
                if (s.type === 'links_page') { e.preventDefault(); return }
                setDragIndex(i)
                setSelectedIndex(null)
                try { e.dataTransfer?.setData('text/plain', String(i)) } catch {}
              }}
              onDragOver={(e) => { e.preventDefault(); setDropIndex(i); setDropAtEnd(false) }}
              onDrop={(e) => {
                e.preventDefault()
                const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1)
                setDragIndex(null); setDropIndex(null); setDropAtEnd(false)
                if (Number.isNaN(from) || from < 0) return
                handleDropReorder(from, i)
              }}
              onDragEnd={() => { setDragIndex(null); setDropIndex(null); setDropAtEnd(false) }}
              style={{ padding: '6px 0', borderTop: i? '1px solid var(--sb-color-border)' : undefined }}
            >
              {dragIndex != null && dropIndex === i && i !== 0 ? (
                <div style={{ height: 8, margin: '0 0 6px 0', borderTop: '2px solid #111', borderRadius: 2, opacity: .8 }} />
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: selectedIndex===i?'#f5f5f5':'transparent' }}>
                <span style={{ width: 24, textAlign: 'right', opacity: .6 }}>{i+1}.</span>
                <button
                  onClick={() => setSelectedIndex(selectedIndex===i ? null : i)}
                  style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'capitalize', padding: 0 }}
                  title={s.type==='links_page' ? 'Links List renders only when selected' : undefined}
                >
                  {s.type === 'links_page' ? 'links list (link-in-bio)' : s.type.replace('_', ' ')}
                </button>
                <span style={{ opacity: .7 }}>— #{(s as any).slug || (s as any).id?.slice?.(0, 8) || 'section'}</span>
                <button onClick={() => removeSection(i)} style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }}>Remove</button>
              </div>
              {selectedIndex === i && (
                <SectionEditorContainer sectionType={s.type as any} />
              )}
            </li>
          ))}
        </ul>
      )}
          </div>
        )}
        {activeTab === 'branding' && (
          <div>
            <strong>Branding</strong>
            <div style={{ marginTop: 8 }}>
              <BrandingPanel />
            </div>
          </div>
        )}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <strong>Media Library</strong>
            </div>
            <InlineImageLibrary businessId="9bd00fb7-0f2b-495d-a65d-88681905e76e" />
          </div>
        )}
      </div>
      {activeTab === 'sections' && dragIndex != null && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDropAtEnd(true); setDropIndex(sections.length) }}
          onDrop={(e) => {
            e.preventDefault()
            const from = dragIndex != null ? dragIndex : Number(e.dataTransfer?.getData('text/plain') || -1)
            setDragIndex(null); setDropIndex(null); setDropAtEnd(false)
            if (Number.isNaN(from) || from < 0) return
            handleDropReorder(from, sections.length)
          }}
          style={{
            marginTop: 6,
            padding: '8px 8px',
            border: '1px dashed var(--sb-color-border)',
            borderRadius: 6,
            textAlign: 'center',
            background: dropAtEnd ? '#fafafa' : 'transparent',
            color: 'var(--sb-color-text)',
            fontSize: 12,
          }}
        >
          Drop here to place last
        </div>
      )}
      
      {/* Read-only overlay when viewing published or in preview mode */}
      {isReadOnlyMode && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          backdropFilter: 'blur(1px)'
        }}>
          <div style={{
            background: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--sb-color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            fontSize: '14px',
            color: '#374151'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {isPreviewMode ? '👁️ Preview Mode' : '📖 Viewing Published Version'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {isPreviewMode ? 'Restore version to edit' : 'Switch to Draft to make changes'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionEditorContainer({ sectionType }: { sectionType: string }) {
  const { panelView, setPanelView } = useBuilder() as any
  if (panelView === 'media') {
    return (
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setPanelView('editor')} style={{ padding: '4px 8px', border: '1px solid var(--sb-color-border)', borderRadius: 6 }}>
            ← Back
          </button>
          <strong style={{ marginLeft: 4 }}>Image settings</strong>
        </div>
        <InlineImageSettings />
      </div>
    )
  }
  return (
    <div>
      {sectionType === 'hero' && <HeroEditor />}
      {sectionType === 'content_block' && <ContentBlockEditor />}
      {sectionType === 'business_data' && <BusinessDataEditor />}
      {sectionType === 'links_page' && <LinksPageEditor />}
      {sectionType === 'schedule' && <ScheduleEditor />}
    </div>
  )
}

function InlineImageSettings() {
  // Reuse the existing panel component but render its inner content inline
  // We'll import and render ImageSettingsPanel inline without the overlay/backdrop
  return <ImageSettingsPanel inline />
}

function InlineImageLibrary({ businessId }: { businessId: string }) {
  const [images, setImages] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { imageManagerOnSelect } = useBuilder()

  React.useEffect(() => {
    loadImages()
  }, [businessId])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/aws/business/${businessId}/image/list/?folder=gallery`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to load images: ${response.status}`)
      }
      
      const data = await response.json()
      setImages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
    
    if (file.size > maxSize) {
      setError('File is too large (max 10MB)')
      return
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('Only image files (JPEG, PNG, GIF, BMP, WebP) are allowed')
      return
    }

    try {
      setUploading(true)
      setError(null)
      await ensureCsrfCookie()
      
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'gallery')
      
      const response = await fetch(`/api/aws/business/${businessId}/image/upload/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const newImage = await response.json()
      setImages(prev => [newImage, ...prev])
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      await ensureCsrfCookie()
      const response = await fetch(`/api/aws/business/${businessId}/image/${imageId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`)
      }
      
      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleFileSelect}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px dashed var(--sb-color-border)',
            borderRadius: 8,
            background: uploading ? '#f5f5f5' : '#fff',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          {uploading ? 'Uploading...' : '+ Upload New Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div style={{ 
          padding: '8px 12px', 
          background: '#fee', 
          border: '1px solid #fcc', 
          borderRadius: 6, 
          marginBottom: 16,
          fontSize: 14,
          color: '#c33'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>
          Loading images...
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>
          No images found. Upload your first image!
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: 12,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {images.map((image) => (
            <div key={image.id} style={{ 
              border: '1px solid var(--sb-color-border)', 
              borderRadius: 8, 
              overflow: 'hidden',
              background: '#fff'
            }}>
              <div 
                onClick={() => imageManagerOnSelect?.(image.url)}
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: `url(${image.url}) center/cover no-repeat`
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="hover:opacity-100">
                  <div style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    Select
                  </div>
                </div>
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 500, 
                  marginBottom: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {image.name}
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: '#666',
                  marginBottom: 8
                }}>
                  {formatFileSize(image.size)}
                </div>
                {/* Optional metadata editing if supported by API */}
                {'alt_text' in image ? (
                  <input
                    placeholder="Alt text"
                    defaultValue={(image as any).alt_text || ''}
                    onBlur={async (e) => {
                      const value = e.currentTarget.value
                      try {
                        await ensureCsrfCookie()
                        const resp = await fetch(`/api/aws/business/${businessId}/image/${image.id}/`, {
                          method: 'PATCH',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRFToken': getCookie('csrftoken') || '',
                          },
                          body: JSON.stringify({ alt_text: value })
                        })
                        if (resp.ok) {
                          const updated = await resp.json()
                          setImages(prev => prev.map(it => it.id === image.id ? updated : it))
                        }
                      } catch {}
                    }}
                    style={{ width:'100%', border:'1px solid var(--sb-color-border)', borderRadius:4, padding:'4px 6px', fontSize:11, marginBottom:6 }}
                  />
                ) : null}
                {'caption' in image ? (
                  <input
                    placeholder="Caption"
                    defaultValue={(image as any).caption || ''}
                    onBlur={async (e) => {
                      const value = e.currentTarget.value
                      try {
                        await ensureCsrfCookie()
                        const resp = await fetch(`/api/aws/business/${businessId}/image/${image.id}/`, {
                          method: 'PATCH',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRFToken': getCookie('csrftoken') || '',
                          },
                          body: JSON.stringify({ caption: value })
                        })
                        if (resp.ok) {
                          const updated = await resp.json()
                          setImages(prev => prev.map(it => it.id === image.id ? updated : it))
                        }
                      } catch {}
                    }}
                    style={{ width:'100%', border:'1px solid var(--sb-color-border)', borderRadius:4, padding:'4px 6px', fontSize:11, marginBottom:6 }}
                  />
                ) : null}
                <button
                  onClick={() => handleDelete(image.id)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    border: '1px solid #fcc',
                    borderRadius: 4,
                    background: '#fff',
                    color: '#c33',
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Consolidated dropdown for adding sections
 */
function AddSectionDropdown() {
  const { addSection, setSelectedIndex, reorderSections } = useBuilder()
  const { draft } = useBuilder()
  const sections = draft?.sections || []
  const hasLinks = sections.some(s => s.type === 'links_page')
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  type SectionType = 'hero' | 'content_block' | 'business_data' | 'schedule' | 'links_page'

  interface SectionOption {
    type: SectionType
    label: string
    description: string
    disabled?: boolean
    disabledReason?: string
    createDefault: () => any
    insertAt?: 'top' | 'bottom'
  }

  const sectionOptions: SectionOption[] = [
    {
      type: 'hero',
      label: 'Hero',
      description: 'Eye-catching header with title, subtitle, and call-to-action',
      createDefault: () => ({
        type: 'hero',
        title: 'New Hero',
        subtitle: 'Edit me',
        align: 'center',
        valign: 'center',
        brandEmphasis: true
      })
    },
    {
      type: 'content_block',
      label: 'Content Block',
      description: 'Rich content with text, images, and flexible layouts',
      createDefault: () => ({
        type: 'content_block',
        title: 'Content Block',
        body: 'Write copy here',
        layout: 'media_top',
        background: 'surface',
        textAlign: 'left',
        media: []
      })
    },
    {
      type: 'business_data',
      label: 'Business Info',
      description: 'Display your business details, hours, and contact info',
      createDefault: () => ({
        type: 'business_data',
        title: 'Business',
        fields: ['business_info']
      })
    },
    {
      type: 'schedule',
      label: 'Schedule',
      description: 'Show your availability and booking calendar',
      createDefault: () => ({
        type: 'schedule',
        title: 'Schedule',
        windowDays: 7
      })
    },
    {
      type: 'links_page',
      label: 'Links List',
      description: 'Link-in-bio style list at the top of your page',
      disabled: hasLinks,
      disabledReason: 'Only one Links List allowed',
      insertAt: 'top',
      createDefault: () => ({
        type: 'links_page',
        title: 'Links',
        links: []
      })
    }
  ]

  const addableOptions = sectionOptions.filter(option => isAddable(option.type))

  const handleSelectSection = (option: SectionOption) => {
    if (option.disabled) return

    const newSection = option.createDefault()

    if (option.insertAt === 'top') {
      // Special handling for links_page - insert at top
      const next = [newSection, ...sections.filter(s => s.type !== 'links_page')]
      reorderSections(next)
      setSelectedIndex(0)
    } else {
      // Normal append to end
      addSection(newSection)
      setSelectedIndex(sections.length)
    }

    setIsOpen(false)
  }

  return (
    <>
      <div style={{ position: 'relative', marginLeft: 'auto' }}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--sb-color-border)',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          Add Section
          <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div
            style={{
              position: 'fixed',
              top: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 4,
              right: window.innerWidth - (buttonRef.current?.getBoundingClientRect().right || 0),
              background: '#fff',
              border: '1px solid var(--sb-color-border)',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: 280,
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--sb-color-border)', fontWeight: 600, fontSize: 14 }}>
              Choose a section type
            </div>
            
            {addableOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelectSection(option)}
                disabled={option.disabled}
                title={option.disabledReason}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  background: option.disabled ? '#f8f8f8' : '#fff',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #f0f0f0',
                  opacity: option.disabled ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!option.disabled) {
                    e.currentTarget.style.background = '#f8f8f8'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = option.disabled ? '#f8f8f8' : '#fff'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                  {option.label}
                </div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.3 }}>
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
