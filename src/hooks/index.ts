import { useState, useEffect, useCallback } from "react";
import type { PGSummary, SearchFilters, ApiResponse } from "@/types";
import { buildQueryString } from "@/utils";

// ─── usePGs ────────────────────────────────────────────────────────────────────
export function usePGs(filters: SearchFilters) {
  const [pgs, setPGs] = useState<PGSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(filters as Record<string, unknown>);
      const res = await fetch(`/api/pgs?${qs}`);
      const data: ApiResponse<PGSummary[]> = await res.json();

      if (!data.success) throw new Error(data.error);
      setPGs(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PGs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  return { pgs, loading, error, total, refetch: fetchPGs };
}

// ─── usePGDetail ───────────────────────────────────────────────────────────────
export function usePGDetail(id: string) {
  const [pg, setPG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPG = async () => {
      try {
        const res = await fetch(`/api/pgs/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setPG(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PG");
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id]);

  return { pg, loading, error };
}

// ─── useBookings ───────────────────────────────────────────────────────────────
export function useBookings(userId?: string, ownerId?: string) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = buildQueryString({ userId, ownerId });
    fetch(`/api/bookings?${qs}`)
      .then(r => r.json())
      .then(d => { if (d.success) setBookings(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, ownerId]);

  return { bookings, loading };
}

// ─── useInquiries ──────────────────────────────────────────────────────────────
export function useInquiries(userId?: string, pgId?: string) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = buildQueryString({ userId, pgId });
    fetch(`/api/inquiries?${qs}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInquiries(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, pgId]);

  return { inquiries, loading };
}

// ─── useGeolocation ────────────────────────────────────────────────────────────
export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { location, error, loading, getLocation };
}

// ─── useDebounce ───────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─── useLocalStorage ───────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    },
    [key, value]
  );

  return [value, setStoredValue] as const;
}
