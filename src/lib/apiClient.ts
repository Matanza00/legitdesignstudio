const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiGet<T>(
  action: string,
  params: Record<string, string> = {}
): Promise<T> {
  const query = new URLSearchParams({
    action,
    ...params,
  });

  const url = `${API_URL}?${query.toString()}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || json.message || "API error");
  }

  return (json.data ?? []) as T;
}

export async function apiPost<T>(
  action: string,
  data: unknown
): Promise<T> {
  console.log("POST API ACTION:", action, data);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action,
      data,
    }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || json.message || "API error");
  }

  return (json.data ?? {}) as T;
}