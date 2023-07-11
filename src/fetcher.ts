export async function get<T = any>(url: URL, params?: any): Promise<T> {
  if (params) {
    Object.keys(params).map((key) => url.searchParams.append(key, params[key]));
  }

  const response = await fetch(url, { next: { revalidate: 60 } });

  return await response.json();
}
