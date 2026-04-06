export class ApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly responseBody?: string;

    constructor(options: { message: string; status: number; statusText: string; url: string; responseBody?: string }) {
        super(options.message);
        this.name = 'ApiError';
        this.status = options.status;
        this.statusText = options.statusText;
        this.url = options.url;
        this.responseBody = options.responseBody;
    }
}
