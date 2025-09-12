export interface ApiConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${apiConfig.baseUrl}${path}`;

  const isFormData = init?.body instanceof FormData;
  const mergedHeaders: Record<string, string> = {
    ...(isFormData ? {} : apiConfig.defaultHeaders),
    ...((init?.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(url, {
    ...init,
    headers: mergedHeaders,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // Try to parse json, allow empty body
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return res.json() as Promise<T>;
  return undefined as unknown as T;
}
