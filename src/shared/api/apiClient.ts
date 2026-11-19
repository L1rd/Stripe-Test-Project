const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4242";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Unable to connect to the server. Please check your connection.",
      0,
      "network_error",
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as {
      error?: {
        code?: string;
        message?: string;
      };
    } | null;

    throw new ApiError(
      errorData?.error?.message ?? "Сталася помилка сервера.",
      response.status,
      errorData?.error?.code ?? "unknown_error",
    );
  }

  return data as T;
}
