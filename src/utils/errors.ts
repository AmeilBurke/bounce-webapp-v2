import { isAxiosError } from "axios";

// What the API says when an exception is thrown without its own message
const GENERIC_MESSAGES = new Set(["Bad Request", "Unauthorized", "Forbidden", "Not Found", "Conflict"]);

// The API explains why it rejected a request, e.g. "Ban is already approved". Server errors and
// network failures have nothing useful to show, so they fall back to the given message
export const apiErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error) || error.response === undefined || error.response.status >= 500) {
        return fallback;
    }

    const data: unknown = error.response.data;
    if (typeof data !== "object" || data === null || !("message" in data)) return fallback;

    // Failed validation sends a list of messages, of which the first is enough
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    if (typeof message !== "string" || message === "" || GENERIC_MESSAGES.has(message)) {
        return fallback;
    }

    return message;
};
