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

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

function buildUrl(path: string): string {
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

  function extractErrorMessage(body: unknown, res: Response): string {
    if (typeof body === "object" && body !== null) {
      const obj = body as Record<string, unknown>;
      for (const key of ["message", "error", "detail"]) {
        const val = obj[key];
        if (typeof val === "string" && val.length > 0) return val;
      }
    }
    if (res.status === 409) return "User already exists";
    return res.statusText || `Request failed with status ${res.status}`;
  }
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
    const message = extractErrorMessage(parsedBody, response);
    throw new ApiError(message, response.status, parsedBody);
  }

  return parsedBody as T;
}
