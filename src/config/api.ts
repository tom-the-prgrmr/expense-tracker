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
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: mergedHeaders,
    });
  } catch (err) {
    // Normalize network/CORS errors to a consistent, user-friendly message
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes('Failed to fetch') ||
      message.includes('NetworkError') ||
      message.includes('TypeError: Failed to fetch')
    ) {
      throw new Error('Không thể tải dữ liệu');
    }
    throw err instanceof Error ? err : new Error(message);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // Try to parse json, allow empty body
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return res.json() as Promise<T>;
  return undefined as unknown as T;
}

// API functions for budget alerts
export async function fetchAlerts(startDate: number, endDate: number) {
  return apiFetch<import('@/types/api').AlertsResponse>(
    `/api/v1/alert?start_date=${startDate}&end_date=${endDate}&status=2`
  );
}

export async function updateAlert(
  alertId: number,
  data: { title: string; amount: number; status: number }
) {
  return apiFetch(`/api/v1/alert/${alertId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createAlert(data: {
  category_id: number;
  title: string;
  amount: number;
  start_date: number;
  end_date: number;
  type: number;
}) {
  return apiFetch('/api/v1/alert', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// API functions for money notes
export async function fetchMoneyNotes(startDate: number, endDate: number) {
  return apiFetch<import('@/types/api').MoneyNotesResponse>(
    `/api/v1/money-note?start_date=${startDate}&end_date=${endDate}`
  );
}

export async function createMoneyNotes(
  data: Array<{
    type: number;
    note: string;
    amount: number;
    category_id: number;
  }>
) {
  return apiFetch('/api/v1/money-note', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMoneyNote(
  noteId: number,
  data: {
    note: string;
    amount: number;
    category_id: number;
    type: number;
  }
) {
  return apiFetch(`/api/v1/money-note/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMoneyNote(noteId: number) {
  return apiFetch(`/api/v1/money-note/${noteId}`, {
    method: 'DELETE',
  });
}

// API functions for budgets
export async function fetchBudgets() {
  return apiFetch<import('@/types/api').BudgetsResponse>('/api/v1/budget');
}

export async function createBudget(
  data: import('@/types/api').CreateBudgetRequest
) {
  return apiFetch('/api/v1/budget', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBudget(
  budgetId: number,
  data: import('@/types/api').UpdateBudgetRequest
) {
  return apiFetch(`/api/v1/budget/${budgetId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBudget(budgetId: number) {
  return apiFetch(`/api/v1/budget/${budgetId}`, {
    method: 'DELETE',
  });
}
