"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BuilderShell;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const BuilderProvider_1 = require("./context/BuilderProvider");
const api_1 = require("../shared/api");
function isValidSlug(s) {
    return /^[a-z0-9-]{2,50}$/.test(s);
}
function BuilderShell() {
    const { businessId, slug, setSlug, device, setDevice, view, setView, lastSavedAt, save, platformData, draft } = (0, BuilderProvider_1.useBuilder)();
    const url = slug ? `https://${slug}.sites.afya.fit` : 'https://[slug].sites.afya.fit';
    const valid = !slug || isValidSlug(slug);
    const [status, setStatus] = react_1.default.useState('UNPROVISIONED');
    const [copied, setCopied] = react_1.default.useState(false);
    const [publishing, setPublishing] = react_1.default.useState(false);
    const [taskId, setTaskId] = react_1.default.useState(null);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
        catch { }
    };
    const onPublish = async () => {
        if (!slug || !isValidSlug(slug))
            return;
        if (!draft)
            return;
        setPublishing(true);
        setStatus('PROVISIONING');
        try {
            const res = await (0, api_1.publishSite)(businessId, { slug, draft });
            if (res.ok && res.data?.task_id) {
                setTaskId(res.data.task_id);
                pollStatus(res.data.task_id);
            }
            else {
                setStatus(res.ok ? 'LIVE' : 'ERROR');
            }
        }
        catch {
            setStatus('ERROR');
        }
        finally {
            setPublishing(false);
        }
    };
    const pollStatus = async (id) => {
        let attempts = 0;
        const maxAttempts = 30;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        while (attempts < maxAttempts) {
            const r = await (0, api_1.getPublishStatus)(id);
            if (r.ok) {
                const state = r.data?.state;
                if (state === 'SUCCESS') {
                    setStatus('LIVE');
                    setTaskId(null);
                    return;
                }
                if (state === 'FAILURE') {
                    setStatus('ERROR');
                    setTaskId(null);
                    return;
                }
            }
            attempts += 1;
            await delay(1000);
        }
        // timed out
        setStatus('ERROR');
        setTaskId(null);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--sb-color-border)' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Site Builder" }), (0, jsx_runtime_1.jsx)("span", { style: { opacity: .6 }, children: platformData?.business_info?.name || businessId }), (0, jsx_runtime_1.jsxs)("div", { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', rowGap: 8 }, children: [(0, jsx_runtime_1.jsxs)("label", { title: "Lowercase letters, numbers, hyphens; 2\u201350 chars", children: ["Slug:", (0, jsx_runtime_1.jsx)("input", { value: slug, onChange: e => setSlug(e.target.value.toLowerCase()), placeholder: 'my-studio', style: { marginLeft: 6, padding: '6px 8px', border: `1px solid ${valid ? 'var(--sb-color-border)' : '#d00'}`, borderRadius: 6 } })] }), (0, jsx_runtime_1.jsxs)("span", { style: { fontSize: 12, color: valid ? '#666' : '#d00' }, children: [url, !valid ? ' — use a‑z, 0‑9, hyphen' : ''] }), (0, jsx_runtime_1.jsx)("button", { onClick: copy, style: { padding: '6px 8px', borderRadius: 6, border: '1px solid var(--sb-color-border)', display: 'inline-flex', alignItems: 'center', background: '#fff' }, title: copied ? 'Copied!' : 'Copy URL', "aria-label": 'Copy URL', children: (0, jsx_runtime_1.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("rect", { x: "9", y: "9", width: "10", height: "12", rx: "2", fill: copied ? '#e6f6ec' : 'none', stroke: "#666" }), (0, jsx_runtime_1.jsx)("rect", { x: "5", y: "5", width: "10", height: "12", rx: "2", fill: "none", stroke: "#666" })] }) }), (0, jsx_runtime_1.jsx)("span", { style: { padding: '4px 8px', borderRadius: 999, border: '1px solid var(--sb-color-border)', fontSize: 12 }, title: "Publication status", children: taskId ? `${status}…` : status }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 8 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setDevice('desktop'), style: { padding: '6px 10px', background: device === 'desktop' ? '#eee' : '#fff', border: 'none' }, children: "Desktop" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setDevice('mobile'), style: { padding: '6px 10px', background: device === 'mobile' ? '#eee' : '#fff', border: 'none', borderLeft: '1px solid var(--sb-color-border)' }, children: "Mobile" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setView('draft'), style: { padding: '6px 10px', background: view === 'draft' ? '#eee' : '#fff', border: 'none' }, children: "Draft" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setView('published'), style: { padding: '6px 10px', background: view === 'published' ? '#eee' : '#fff', border: 'none', borderLeft: '1px solid var(--sb-color-border)' }, children: "Published" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: save, style: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)' }, children: "Save" }), (0, jsx_runtime_1.jsx)("button", { onClick: onPublish, disabled: !slug || !valid || !draft || publishing, title: !slug ? 'Enter a slug first' : !valid ? 'Invalid slug' : undefined, style: { padding: '6px 10px', borderRadius: 6, border: '1px solid var(--sb-color-border)', opacity: (!slug || !valid || publishing) ? .6 : 1 }, children: publishing ? 'Publishing…' : 'Publish' }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: 12, color: '#666' }, children: lastSavedAt ? `Saved at ${lastSavedAt.toLocaleTimeString()}` : 'Not saved yet' })] })] }));
}
