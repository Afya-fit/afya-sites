"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPublicSiteData = fetchPublicSiteData;
exports.saveSiteDraft = saveSiteDraft;
exports.publishSite = publishSite;
exports.getPublishStatus = getPublishStatus;
function getCookie(name) {
    if (typeof document === 'undefined')
        return null;
    const pattern = new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)');
    const match = document.cookie.match(pattern);
    return match ? decodeURIComponent(match[1]) : null;
}
async function ensureCsrfCookie() {
    if (typeof document === 'undefined')
        return;
    if (getCookie('csrftoken'))
        return;
    const candidates = ['/api/csrf/', '/api/user/current', '/api/'];
    for (const url of candidates) {
        try {
            await fetch(url, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            if (getCookie('csrftoken'))
                return;
        }
        catch {
            // ignore and try next
        }
    }
}
async function fetchPublicSiteData(businessId) {
    try {
        const res = await fetch(`/api/public/sites/data-for/${businessId}`, {
            credentials: 'include',
        });
        if (!res.ok)
            return null;
        return await res.json();
    }
    catch {
        return null;
    }
}
async function saveSiteDraft(businessId, payload) {
    try {
        await ensureCsrfCookie();
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
        });
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
async function publishSite(businessId, payload) {
    try {
        await ensureCsrfCookie();
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
        });
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
async function getPublishStatus(taskId) {
    try {
        const res = await fetch(`/api/sitebuilder/publish/${taskId}/status/`, {
            credentials: 'include',
            headers: { Accept: 'application/json' },
        });
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
