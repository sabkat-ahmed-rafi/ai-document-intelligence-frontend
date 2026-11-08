import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";

  // RTK Query FetchBaseQueryError
  if (typeof error === "object" && error !== null && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    const data = fetchError.data as Record<string, unknown> | undefined;

    if (data) {
      if (typeof data.message === "string" && data.message) {
        return data.message;
      }
      if (typeof data.detail === "string" && data.detail) {
        return data.detail;
      }
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item: unknown) => {
            if (typeof item === "object" && item !== null && "msg" in item) {
              return String((item as { msg: unknown }).msg);
            }
            return "Validation error";
          })
          .join(", ");
      }
    }

    if (fetchError.status === "FETCH_ERROR") {
      return "Unable to connect to backend server. Please verify the backend is running.";
    }

    return `Request failed (${fetchError.status})`;
  }

  // Standard JavaScript Error
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
