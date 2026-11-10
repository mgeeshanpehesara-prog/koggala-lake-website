import { NextResponse } from "next/server";
import { adminCredentials, getAdminSessionToken, getMissingAdminEnvVars } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const missing = getMissingAdminEnvVars();
  if (missing.length > 0) {
    // Log only the names of the missing variables for operators — never values.
    console.error(`Admin login blocked: missing required environment variable(s): ${missing.join(", ")}.`);
    return NextResponse.json(
      {
        error:
          "Admin login is not configured on this deployment yet. The site owner needs to set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_TOKEN in the hosting provider's environment variables (e.g. Vercel Project Settings → Environment Variables) for the Production environment, then redeploy.",
        notConfigured: true,
      },
      { status: 503 },
    );
  }

  const credentials = adminCredentials();
  const normalizedEmail = email.trim().toLowerCase();
  const configuredEmail = credentials.email.trim().toLowerCase();
  if (!normalizedEmail || !password || normalizedEmail !== configuredEmail || password !== credentials.password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const sessionToken = getAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
