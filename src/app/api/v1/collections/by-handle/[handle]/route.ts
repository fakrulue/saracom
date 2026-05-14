import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  try {
    const collection = await prisma.collection.findFirst({
      where: { handle },
      include: {
        products: {
          include: { product: true },
          orderBy: { position: "asc" }
        }
      }
    });

    if (!collection) {
      return NextResponse.json({ errors: ["Collection not found"] }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}