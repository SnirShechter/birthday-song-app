declare class ApiError extends Error {
    status: number;
    data?: unknown | undefined;
    constructor(status: number, message: string, data?: unknown | undefined);
}
export declare const api: {
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    patch<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
};
export default api;
export { ApiError };
//# sourceMappingURL=api.d.ts.map