import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CollectionService } from "@/services/collection.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        rules: {
          include: {
            conditions: true
          }
        },
        products: {
          include: {
            product: true
          },
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!collection) {
      return NextResponse.json({ errors: ["Collection not found"] }, { status: 404 });
    }

    return NextResponse.json({ data: collection });
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
    const collection = await CollectionService.updateCollection(id, body);
    return NextResponse.json({ data: collection });
  } catch (error: any) {
    console.error("Collection update error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.collection.delete({
      where: { id }
    });
    return NextResponse.json({ data: { success: true } });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}