const BASE_URL = import.meta.env.VITE_API_URL || '';
class ApiError extends Error {
    status;
    data;
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}
async function request(method, path, body) {
    const url = `${BASE_URL}${path}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const config = {
        method,
        headers,
    };
    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(url, config);
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        }
        catch {
            // Response body is not JSON
        }
        const message = errorData &&
            typeof errorData === 'object' &&
            'message' in errorData &&
            typeof errorData.message === 'string'
            ? errorData.message
            : `Request failed with status ${response.status}`;
        throw new ApiError(response.status, message, errorData);
    }
    // Handle 204 No Content
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
export const api = {
    get(path) {
        return request('GET', path);
    },
    post(path, body) {
        return request('POST', path, body);
    },
    patch(path, body) {
        return request('PATCH', path, body);
    },
    put(path, body) {
        return request('PUT', path, body);
    },
    delete(path) {
        return request('DELETE', path);
    },
};
export default api;
export { ApiError };
