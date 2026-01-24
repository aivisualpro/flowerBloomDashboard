// src/hooks/useLiveSalesBreakdown.js
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

export default function useLiveSalesBreakdown({ intervalMs = 10000, tz = 'UTC', status = 'delivered', dateField = 'createdAt' } = {}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        let timer, aborted = false;

        const load = async () => {
            try {
                const qs = new URLSearchParams({ tz, status, dateField }).toString();
                const res = await fetch(`${API_BASE_URL}/analytics/sales?${qs}`, {
                    cache: 'no-store', // avoid browser cache
                    headers: { 'Cache-Control': 'no-store' }
                });
                const json = await res.json();
                if (!aborted) setData(json);
            } catch (e) {
                console.error('sales-breakdown fetch error:', e);
            }
        };

        load();
        timer = setInterval(load, intervalMs);
        return () => { aborted = true; clearInterval(timer); };
    }, [intervalMs, tz, status, dateField]);

    return data;
}
