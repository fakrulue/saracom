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
        { productName: { contains: search } },
        { reviewerName: { contains: search } },
        { reviewText: { contains: search } },
      ];
    }
    
    if (status !== "all") {
      where.status = status;
    }

    const reviews = await prisma.videoReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: reviews });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productName, videoUrl, reviewerName, reviewText, rating } = body;

  try {
    const review = await prisma.videoReview.create({
      data: {
        productName,
        videoUrl,
        reviewerName,
        reviewText,
        rating: rating || 5,
        status: "pending",
      },
    });
    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}