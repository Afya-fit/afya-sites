import React, { useState, useEffect, useRef } from 'react'
import { ensureCsrfCookie, getCookie } from '../utils/api'

interface BusinessImageFile {
  id: number
  name: string
  url: string
  size: number
  created_at: string
  s3_key: string
  business_id: string
}

interface Props {
  businessId: string
  onSelect: (url: string) => void
  onClose: () => void
  folder?: string
}

export default function ImageLibrary({ businessId, onSelect, onClose, folder = 'gallery' }: Props) {
  const [images, setImages] = useState<BusinessImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadImages()
  }, [businessId, folder])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('[ImageLibrary] Loading images for business:', businessId)
      
      const response = await fetch(`/api/aws/business/${businessId}/image/list/?folder=${folder}`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      
      console.log('[ImageLibrary] Response status:', response.status)
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const errorText = await response.text()
          console.error('[ImageLibrary] Auth error:', errorText)
          setError('Not authenticated. Please refresh and try again.')
          return
        }
        throw new Error(`Failed to load images: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('[ImageLibrary] Loaded images:', data.length)
      setImages(data)
    } catch (err) {
      console.error('[ImageLibrary] Error:', err)
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
      formData.append('folder', folder)
      
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
        if (response.status === 401 || response.status === 403) {
          // Redirect to login if not authenticated
          window.location.href = '/login'
          return
        }
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
        if (response.status === 401 || response.status === 403) {
          // Redirect to login if not authenticated
          window.location.href = '/login'
          return
        }
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
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'grid', 
      gridTemplateColumns: '400px 1fr', 
      background: 'rgba(0,0,0,0.5)', 
      zIndex: 20 
    }}>
      <div style={{ 
        background: '#fff', 
        borderRight: '1px solid var(--sb-color-border)', 
        padding: 16,
        overflow: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Image Library</h3>
          <button 
            onClick={onClose}
            style={{ 
              padding: '6px 12px', 
              border: '1px solid var(--sb-color-border)', 
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

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
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 12 
          }}>
            {images.map((image) => (
              <div key={image.id} style={{ 
                border: '1px solid var(--sb-color-border)', 
                borderRadius: 8, 
                overflow: 'hidden',
                background: '#fff'
              }}>
                <div 
                  onClick={() => onSelect(image.url)}
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
      <div onClick={onClose} />
    </div>
  )
}
