import { NextResponse } from "next/server";
import { getAllProducts, upsertProduct, deleteProduct } from "@/lib/data/product-store";
import { isAdmin } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export async function GET(){ if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await getAllProducts()); }
export async function POST(req:Request){ if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401}); const p=await req.json(); return NextResponse.json(await upsertProduct(p),{status:201}); }
export async function PUT(req:Request){ if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401}); const p=await req.json(); return NextResponse.json(await upsertProduct(p)); }
export async function DELETE(req:Request){ if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401}); const {slug}=await req.json(); await deleteProduct(slug); return NextResponse.json({ok:true}); }
