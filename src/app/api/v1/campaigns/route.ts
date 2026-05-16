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

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: campaigns });
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, status } = body;

  try {
    const campaign = await prisma.campaign.create({
      data: {
        name,
        status: status || "draft",
        reach: 0,
        clicks: 0,
      },
    });
    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}