import { useEffect, useState, useCallback, useRef } from "react";
import { leadsApi } from "../api/leads.api";

export type Stats = {
  total: number;
  counts: Record<string, number>;
  newThisMonth: number;
  newThisWeek: number;
  vsLastMonth: number;      // positive = growth, negative = decline
  conversionRate: number;   // 0–100
};

export const useStats = (opts?: { pollIntervalMs?: number }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const s = await leadsApi.getStats();
      if (mounted.current) setStats(s);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetch();
    let id: number | undefined;
    if (opts?.pollIntervalMs) {
      id = window.setInterval(fetch, opts.pollIntervalMs);
    }
    return () => {
      mounted.current = false;
      if (id) clearInterval(id);
    };
  }, [fetch, opts?.pollIntervalMs]);

  return { stats, loading, refresh: fetch } as const;
};

export default useStats;
