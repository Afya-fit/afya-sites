export async function fetchPublicSiteData(businessId) {
    try {
        const res = await fetch(`/api/public/sites/data-for/${businessId}`);
        if (!res.ok)
            return null;
        return await res.json();
    }
    catch {
        return null;
    }
}
export async function saveSiteDraft(businessId, payload) {
    try {
        const res = await fetch(`/api/sitebuilder/${businessId}/draft/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
export async function publishSite(businessId, payload) {
    try {
        const res = await fetch(`/api/sitebuilder/${businessId}/publish/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
export async function getPublishStatus(taskId) {
    try {
        const res = await fetch(`/api/sitebuilder/publish/${taskId}/status/`);
        const data = await res.json().catch(() => undefined);
        return { ok: res.ok, data };
    }
    catch {
        return { ok: false };
    }
}
