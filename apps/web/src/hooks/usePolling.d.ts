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
export declare function usePolling<T>({ url, interval, enabled, shouldStop, fetcher, }: UsePollingOptions<T>): UsePollingResult<T>;
export {};
//# sourceMappingURL=usePolling.d.ts.map