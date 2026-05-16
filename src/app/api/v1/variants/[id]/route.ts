import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        inventoryQty: body.inventoryQty !== undefined ? parseInt(body.inventoryQty) : undefined,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? parseFloat(body.compareAtPrice) : null) : undefined,
        sku: body.sku !== undefined ? body.sku : undefined,
        barcode: body.barcode !== undefined ? body.barcode : undefined,
      }
    });

    return NextResponse.json({ data: variant });
  } catch (error: any) {
    console.error("Variant update error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}