import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred.";

  if ("status" in (error as FetchBaseQueryError)) {
    const err = error as FetchBaseQueryError;

    if (typeof err.data === "object" && err.data !== null && "message" in err.data) {
      return (err.data as { message?: string }).message || "An error occurred.";
    }

    return `Request failed with status ${err.status}.`;
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred.";
};
