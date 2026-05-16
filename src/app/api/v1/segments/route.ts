import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const segments = await prisma.segment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: segments });
  } catch (error: any) {
    console.error("Error fetching segments:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, query, count, growth, color } = body;

  try {
    const segment = await prisma.segment.create({
      data: {
        name,
        query,
        count: count || 0,
        growth,
        color: color || "text-slate-600 bg-slate-50",
      },
    });
    return NextResponse.json({ data: segment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating segment:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}