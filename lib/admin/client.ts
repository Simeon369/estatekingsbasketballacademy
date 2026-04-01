export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ek_admin_jwt");
}

export async function adminFetch(input: string, init?: RequestInit) {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

