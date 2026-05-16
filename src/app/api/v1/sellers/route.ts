import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  try {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { owner: { contains: search } },
        { email: { contains: search } },
      ];
    }
    
    if (status !== "all") {
      where.status = status;
    }

    const sellers = await prisma.seller.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: sellers });
  } catch (error: any) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, owner, email, phone } = body;

  try {
    const seller = await prisma.seller.create({
      data: {
        name,
        owner,
        email,
        phone,
        status: "pending",
      },
    });
    return NextResponse.json({ data: seller }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating seller:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}