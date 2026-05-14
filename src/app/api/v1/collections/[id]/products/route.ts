import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const products = await prisma.collectionProduct.findMany({
      where: { collectionId: id },
      include: {
        product: {
          include: {
            variants: true,
            media: true
          }
        }
      },
      orderBy: { position: "asc" }
    });

    return NextResponse.json({ data: products });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { productIds } = await request.json();

  try {
    await prisma.collectionProduct.deleteMany({
      where: { collectionId: id }
    });

    if (productIds && productIds.length > 0) {
      await prisma.collectionProduct.createMany({
        data: productIds.map((productId: string, index: number) => ({
          collectionId: id,
          productId,
          position: index,
        })),
      });
    }

    const products = await prisma.collectionProduct.findMany({
      where: { collectionId: id },
      include: { product: true },
      orderBy: { position: "asc" }
    });

    return NextResponse.json({ data: products });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    if (productId) {
      await prisma.collectionProduct.deleteMany({
        where: {
          collectionId: id,
          productId
        }
      });
    } else {
      await prisma.collectionProduct.deleteMany({
        where: { collectionId: id }
      });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}