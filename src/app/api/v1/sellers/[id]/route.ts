import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const seller = await prisma.seller.update({
      where: { id },
      data: {
        status: body.status,
        sales: body.sales,
        products: body.products,
      },
    });
    return NextResponse.json({ data: seller });
  } catch (error: any) {
    console.error("Error updating seller:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.seller.delete({ where: { id } });
    return NextResponse.json({ data: { success: true } });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}