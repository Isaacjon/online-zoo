import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

export function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  return `${base}${pathPart}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  const url = buildUrl(path);
  const response = await fetch(url, init);

  let parsedBody: unknown;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      parsedBody = await response.json();
    } catch {
      parsedBody = null;
    }
  } else {
    parsedBody = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof parsedBody === "object" &&
      parsedBody !== null &&
      "message" in parsedBody &&
      typeof (parsedBody as { message: unknown }).message === "string"
        ? (parsedBody as { message: string }).message
        : response.statusText || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, parsedBody);
  }

  return parsedBody as T;
}
