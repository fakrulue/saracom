import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";

  try {
    const where: any = {};
    if (status !== "all") {
      where.status = status;
    }

    const discounts = await prisma.discount.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: discounts });
  } catch (error: any) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { code, type, value, usageLimit, expiry } = body;

  try {
    const discount = await prisma.discount.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiry,
        status: "active",
      },
    });
    return NextResponse.json({ data: discount }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating discount:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}