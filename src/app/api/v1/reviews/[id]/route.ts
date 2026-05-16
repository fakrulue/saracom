import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const review = await prisma.videoReview.update({
      where: { id },
      data: {
        status: body.status,
        reviewText: body.reviewText,
        rating: body.rating,
      },
    });
    return NextResponse.json({ data: review });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.videoReview.delete({ where: { id } });
    return NextResponse.json({ data: { success: true } });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}