import { cookies } from "next/headers";

// Admin credentials and session secret are read live from process.env on every
// call (never cached at module scope) so a redeploy with updated environment
// variables always takes effect without any stale values lingering.
export function adminCredentials() {
  return { email: process.env.ADMIN_EMAIL || "", password: process.env.ADMIN_PASSWORD || "" };
}

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN?.trim() || "";
}

// Lists which of the required server-side admin environment variables are
// missing, without ever revealing their values. Used to produce a clear,
// non-sensitive error message when the hosting environment isn't configured.
export function getMissingAdminEnvVars(): string[] {
  const required = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_SESSION_TOKEN"] as const;
  return required.filter((name) => !process.env[name]?.trim());
}

export async function isAdmin() {
  const token = getAdminSessionToken();
  if (!token) return false;
  return (await cookies()).get("admin_session")?.value === token;
}
