import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const rawFile = formData.get("file");

  if (!(rawFile instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!rawFile.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const extension = (rawFile.name.split(".").pop() || "png").toLowerCase();
  const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, safeFileName);
  const bytes = await rawFile.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${safeFileName}` });
}
