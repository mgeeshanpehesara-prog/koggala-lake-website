import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getWebsiteContent, saveWebsiteContent, type WebsiteContent } from "@/lib/data/website-content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getWebsiteContent());
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = (await request.json()) as WebsiteContent;
  if (!content?.home || !content.about || !content.general) {
    return NextResponse.json({ error: "Invalid website content." }, { status: 400 });
  }
  return NextResponse.json(await saveWebsiteContent(content));
}
