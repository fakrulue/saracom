import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductService } from "@/services/product.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        options: true,
        media: true
      }
    });

    if (!product) {
      return NextResponse.json({ errors: ["Product not found"] }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const product = await ProductService.updateProduct(id, body);
    return NextResponse.json({ data: product });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id }
    });
    return NextResponse.json({ data: { success: true } });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}