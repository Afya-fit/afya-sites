import React, { useMemo, useEffect, useState } from 'react'
import { BuilderProvider, BuilderShell, PreviewPane, SectionManager } from '../../../src'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'

// Simple layout for standalone sitebuilder app
function SitebuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-root" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e9ecef', 
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Afya Sitebuilder</h1>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>Standalone App</div>
      </header>
      <main>{children}</main>
    </div>
  )
}

interface SiteBuilderPageProps {
  hasAccess: boolean
  errorMessage?: string
}

export default function SiteBuilderPage({ hasAccess, errorMessage }: SiteBuilderPageProps) {
  const router = useRouter()
  const { id } = router.query

  const businessId = typeof id === 'string' ? id : ''

  if (!hasAccess) {
    return (
      <SitebuilderLayout>
        <div style={{ 
          padding: '48px 24px', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px' 
          }}>🔒</div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#dc3545'
          }}>Access Denied</h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#6c757d',
            marginBottom: '24px'
          }}>
            {errorMessage || 'You do not have permission to access the sitebuilder for this business.'}
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#868e96' 
          }}>
            Only business owners, admins, and Afya superadmins can access the sitebuilder.
          </p>
          <button
            onClick={() => router.back()}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Go Back
          </button>
        </div>
      </SitebuilderLayout>
    )
  }

  return (
    <SitebuilderLayout>
      <div style={{ padding: 16 }}>
        <BuilderProvider businessId={businessId}>
          <BuilderShell />
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, marginTop: 12 }}>
            <div>
              <SectionManager />
            </div>
            <PreviewPane />
          </div>
        </BuilderProvider>
      </div>
    </SitebuilderLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, sessionid, csrftoken } = context.query
  const cookies = context.req.headers.cookie || ''

  // Extract session ID from URL parameter (passed from admin) or cookies
  let sessionId = sessionid as string | null
  let csrfToken = csrftoken as string | null
  
  if (!sessionId) {
    const sessionIdMatch = cookies.match(/sessionid=([^;]+)/)
    sessionId = sessionIdMatch ? sessionIdMatch[1] : null
  }
  
  if (!csrfToken) {
    const csrfTokenMatch = cookies.match(/csrftoken=([^;]+)/)
    csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null
  }

  console.log('[Sitebuilder Auth] Business ID:', id)
  console.log('[Sitebuilder Auth] Session ID exists:', !!sessionId)
  console.log('[Sitebuilder Auth] CSRF Token exists:', !!csrfToken)
  console.log('[Sitebuilder Auth] Session ID preview:', sessionId ? sessionId.substring(0, 20) + '...' : 'none')
  
  if (!sessionId) {
    console.log('[Sitebuilder Auth] DENIED: No session ID found')
    return {
      props: {
        hasAccess: false,
        errorMessage: 'You must be logged in to access the sitebuilder.'
      }
    }
  }

  try {
    // Check access by attempting to fetch draft
    // The backend RBAC will handle permission checking
    // Use NEXT_PUBLIC_API_URL as the single source of truth for the backend base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
    
    console.log('[Sitebuilder Auth] Checking access for business:', id)
    console.log('[Sitebuilder Auth] Making API call to:', `${apiUrl}/sitebuilder/${id}/draft/`)
    
    // Django uses session-based auth via cookies
    const cookieHeader = csrfToken 
      ? `sessionid=${sessionId}; csrftoken=${csrfToken}`
      : `sessionid=${sessionId}`
    
    const headers: HeadersInit = {
      'Cookie': cookieHeader,
      'Content-Type': 'application/json'
    }
    
    // Add CSRF header if we have the token (required for safe methods in some Django configs)
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }
    
    const response = await fetch(`${apiUrl}/sitebuilder/${id}/draft/`, {
      headers,
      credentials: 'include'
    })
    
    console.log('[Sitebuilder Auth] Response status:', response.status)

    if (response.status === 403) {
      console.log('[Sitebuilder Auth] DENIED: 403 Forbidden')
      return {
        props: {
          hasAccess: false,
          errorMessage: 'You do not have permission to access this business\'s sitebuilder.'
        }
      }
    }

    if (response.status === 401) {
      console.log('[Sitebuilder Auth] DENIED: 401 Unauthorized')
      return {
        props: {
          hasAccess: false,
          errorMessage: 'Your session has expired. Please log in again.'
        }
      }
    }

    if (response.status === 404) {
      console.log('[Sitebuilder Auth] DENIED: 404 Not Found')
      return {
        props: {
          hasAccess: false,
          errorMessage: 'Business not found.'
        }
      }
    }

    // If we get here, user has access
    console.log('[Sitebuilder Auth] GRANTED: Status', response.status)
    return {
      props: {
        hasAccess: true
      }
    }
  } catch (error) {
    console.error('Error checking sitebuilder access:', error)
    return {
      props: {
        hasAccess: false,
        errorMessage: 'Unable to verify access. Please try again.'
      }
    }
  }
}


