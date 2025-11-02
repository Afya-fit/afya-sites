export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const pattern = new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)')
  const match = document.cookie.match(pattern)
  return match ? decodeURIComponent(match[1]) : null
}

export async function ensureCsrfCookie(): Promise<void> {
  if (typeof document === 'undefined') return
  if (getCookie('csrftoken')) return
  const candidates = ['/api/csrf/', '/api/user/current', '/api/']
  for (const url of candidates) {
    try {
      await fetch(url, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      if (getCookie('csrftoken')) return
    } catch {
      // ignore and try next
    }
  }
}

export async function fetchPublicSiteData(businessId: string): Promise<any> {
  try {
    const res = await fetch(`/api/public/sites/data-for/${businessId}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function saveSiteDraft(businessId: string, payload: any): Promise<{ ok: boolean; data?: any }> {
  try {
    await ensureCsrfCookie()
    const res = await fetch(`/api/sitebuilder/${businessId}/draft/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => undefined)
    return { ok: res.ok, data }
  } catch {
    return { ok: false }
  }
}

export async function publishSite(businessId: string, payload: any): Promise<{ ok: boolean; data?: any }> {
  try {
    await ensureCsrfCookie()
    const res = await fetch(`/api/sitebuilder/${businessId}/publish/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => undefined)
    return { ok: res.ok, data }
  } catch {
    return { ok: false }
  }
}

export async function getPublishStatus(taskId: string): Promise<{ ok: boolean; data?: any }> {
  try {
    const res = await fetch(`/api/sitebuilder/publish/${taskId}/status/`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    const data = await res.json().catch(() => undefined)
    return { ok: res.ok, data }
  } catch {
    return { ok: false }
  }
}

export async function loadSiteDraft(businessId: string): Promise<{ ok: boolean; data?: any }> {
  try {
    await ensureCsrfCookie()
    const res = await fetch(`/api/sitebuilder/${businessId}/draft/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    const data = await res.json().catch(() => undefined)
    return { ok: res.ok, data }
  } catch {
    return { ok: false }
  }
}


