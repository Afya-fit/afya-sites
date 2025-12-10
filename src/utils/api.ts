/**
 * Shared API utilities for site builder
 */

export async function ensureCsrfCookie(): Promise<void> {
  try {
    await fetch('/api/csrf', { credentials: 'same-origin', referrerPolicy: 'same-origin' });
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function fetchPublicSiteData(businessId: string) {
  try {
    const response = await fetch(`/api/public/sites/data-for/${businessId}`, {
      credentials: 'same-origin',
      referrerPolicy: 'same-origin'
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch public site data:', error);
    return null;
  }
}

export async function loadSiteDraft(businessId: string) {
  if (!businessId) return { ok: false, error: 'businessId is required' }
  try {
    const response = await fetch(`/api/sitebuilder/${businessId}/draft`, {
      credentials: 'same-origin',
      referrerPolicy: 'same-origin'
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to load site draft:', error);
    return { ok: false, error };
  }
}

export async function saveSiteDraft(businessId: string, payload: any) {
  try {
    await ensureCsrfCookie();
    const response = await fetch(`/api/sitebuilder/${businessId}/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      credentials: 'same-origin',
      referrerPolicy: 'same-origin',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to save site draft:', error);
    return { ok: false, error };
  }
}

export async function provisionSite(businessId: string, payload: any) {
  try {
    await ensureCsrfCookie();
    const response = await fetch(`/api/sitebuilder/${businessId}/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      credentials: 'same-origin',
      referrerPolicy: 'same-origin',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to provision site:', error);
    return { ok: false, error };
  }
}

export async function publishSite(businessId: string, payload: any) {
  try {
    await ensureCsrfCookie();
    const response = await fetch(`/api/sitebuilder/${businessId}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      credentials: 'same-origin',
      referrerPolicy: 'same-origin',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to publish site:', error);
    return { ok: false, error };
  }
}

export async function getSiteSettings(businessId: string) {
  if (!businessId) return { ok: false, error: 'businessId is required' }
  try {
    const response = await fetch(`/api/sitebuilder/${businessId}/site-settings`, {
      credentials: 'same-origin',
      referrerPolicy: 'same-origin'
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return { ok: false, error };
  }
}

export async function getProvisionStatus(businessId: string) {
  try {
    const response = await fetch(`/api/sitebuilder/${businessId}/provision-status`, {
      credentials: 'same-origin',
      referrerPolicy: 'same-origin'
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to get provision status:', error);
    return { ok: false, error };
  }
}

export async function getPublishStatus(taskId: string) {
  try {
    const response = await fetch(`/api/sitebuilder/publish/status/${taskId}`, {
      credentials: 'same-origin',
      referrerPolicy: 'same-origin'
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error('Failed to get publish status:', error);
    return { ok: false, error };
  }
}
