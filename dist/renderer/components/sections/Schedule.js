import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
function formatDay(date) {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
}
function formatDate(date) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export default function Schedule({ section, data }) {
    const windowDays = Math.max(1, Math.min(7, section.windowDays ?? 7));
    const viewMode = section.viewMode ?? 'stacked';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const schedule = (data?.platform_data?.schedule || []);
    const [selectedDate, setSelectedDate] = useState(today);
    const days = useMemo(() => {
        return Array.from({ length: windowDays }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [today]);
    const buckets = useMemo(() => {
        const byDay = new Map();
        days.forEach(d => byDay.set(d.toDateString(), []));
        schedule.forEach(item => {
            const d = new Date(item.starts_at);
            const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
            if (byDay.has(key)) {
                byDay.get(key).push(item);
            }
        });
        // sort by start time
        for (const k of byDay.keys()) {
            byDay.get(k).sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
        }
        return byDay;
    }, [schedule, days]);
    const [expandedDays, setExpandedDays] = useState({});
    return (_jsx("section", { style: { padding: '24px 12px', borderBottom: '1px solid #eee' }, children: _jsxs("div", { style: { maxWidth: 1000, margin: '0 auto' }, children: [section.title ? _jsx("h2", { style: { marginTop: 0 }, children: section.title }) : null, _jsx("div", { style: { display: 'flex', justifyContent: 'center' }, children: _jsx("div", { style: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }, children: days.map((d, i) => {
                            const active = selectedDate ? isSameDay(d, selectedDate) : isSameDay(d, today);
                            return (_jsxs("button", { onClick: () => setSelectedDate(new Date(d.getFullYear(), d.getMonth(), d.getDate())), "aria-selected": active, style: {
                                    padding: '6px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 999,
                                    background: active ? '#111' : '#fff',
                                    color: active ? '#fff' : '#111',
                                    whiteSpace: 'nowrap'
                                }, children: [formatDay(d), " ", formatDate(d)] }, i));
                        }) }) }), _jsx("div", { style: { display: 'grid', gap: 16, marginTop: 8 }, children: (viewMode === 'single_day' ? (selectedDate ? [selectedDate] : [today]) : days).map((d, i) => {
                        const key = d.toDateString();
                        const items = buckets.get(key) || [];
                        const total = items.length;
                        const showAll = expandedDays[key];
                        const shown = showAll ? items : items.slice(0, 10);
                        return (_jsxs("div", { children: [_jsxs("div", { style: { position: 'sticky', top: 0, background: '#fff', padding: '8px 0', borderBottom: '1px solid #eee', zIndex: 0 }, children: [_jsxs("strong", { children: [formatDay(d), ", ", formatDate(d)] }), _jsxs("span", { style: { marginLeft: 8, opacity: .6 }, children: ["\u2022 ", total, " ", total === 1 ? 'class' : 'classes'] })] }), total === 0 ? (_jsx("div", { style: { padding: '8px 0', opacity: .7 }, children: "No classes." })) : (_jsx("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: shown.map((s) => {
                                        const dt = new Date(s.starts_at);
                                        const time = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                                        const hasNumbers = typeof s.capacity === 'number' && typeof s.booked === 'number';
                                        const spots = hasNumbers ? s.capacity - s.booked : undefined;
                                        const available = hasNumbers ? spots > 0 : true; // MVP default to available when unknown
                                        return (_jsxs("li", { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f2f2f2' }, children: [_jsx("span", { style: { width: 64, opacity: .7 }, children: time }), _jsx("span", { style: { flex: 1 }, children: s.title || 'Class' }), _jsx("span", { style: {
                                                        padding: '4px 8px',
                                                        borderRadius: 999,
                                                        fontSize: 12,
                                                        background: available ? '#e6f6ec' : '#fdeaea',
                                                        color: available ? '#137333' : '#a50e0e',
                                                        border: `1px solid ${available ? '#b7e3c5' : '#f5c2c2'}`
                                                    }, children: available ? 'Spots available' : 'Fully booked' })] }, s.id));
                                    }) })), total > 10 && (_jsx("button", { onClick: () => setExpandedDays(prev => ({ ...prev, [key]: !prev[key] })), style: { marginTop: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }, children: showAll ? `Show less` : `Show all ${total}` }))] }, i));
                    }) })] }) }));
}
