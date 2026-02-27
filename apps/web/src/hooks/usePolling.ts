import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions<T> {
  url: string;
  interval?: number;
  enabled?: boolean;
  shouldStop?: (data: T) => boolean;
  fetcher?: (url: string) => Promise<T>;
}

interface UsePollingResult<T> {
  data: T | null;
  isPolling: boolean;
  error: Error | null;
  startPolling: () => void;
  stopPolling: () => void;
}

export function usePolling<T>({
  url,
  interval = 3000,
  enabled = true,
  shouldStop,
  fetcher,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabledRef = useRef(enabled);
  const mountedRef = useRef(true);

  enabledRef.current = enabled;

  const defaultFetcher = useCallback(
    async (fetchUrl: string): Promise<T> => {
      const response = await fetch(fetchUrl, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Polling request failed with status ${response.status}`);
      }
      return response.json();
    },
    [],
  );

  const fetchFn = fetcher ?? defaultFetcher;

  const poll = useCallback(async () => {
    if (!enabledRef.current || !mountedRef.current) return;

    try {
      const result = await fetchFn(url);
      if (!mountedRef.current) return;

      setData(result);
      setError(null);

      if (shouldStop && shouldStop(result)) {
        setIsPolling(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [url, fetchFn, shouldStop]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPolling(true);
    setError(null);
    // Immediate first fetch
    poll();
    intervalRef.current = setInterval(poll, interval);
  }, [poll, interval]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      startPolling();
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  return { data, isPolling, error, startPolling, stopPolling };
}
