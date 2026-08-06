

class AppError extends Error {
    statusCode: number;
    retryAfter?: number;

    constructor(message: string, statusCode: number, retryAfter?: number) {
        super(message);
        this.statusCode = statusCode;
        if (retryAfter !== undefined) {
            this.retryAfter = retryAfter;
        }
    }
}
export { AppError };
