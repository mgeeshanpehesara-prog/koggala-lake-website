import { cookies } from "next/headers";
const token = process.env.ADMIN_SESSION_TOKEN || "";
export function adminCredentials(){ return {email:process.env.ADMIN_EMAIL||"", password:process.env.ADMIN_PASSWORD||""}; }
export async function isAdmin(){ return token ? (await cookies()).get("admin_session")?.value===token : false; }
