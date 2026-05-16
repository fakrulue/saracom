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

    const payouts = await prisma.payout.findMany({
      where,
      include: { seller: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: payouts });
  } catch (error: any) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sellerId, method, amount } = body;

  try {
    const payout = await prisma.payout.create({
      data: {
        sellerId,
        method,
        amount,
        status: "pending",
      },
    });
    return NextResponse.json({ data: payout }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payout:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}