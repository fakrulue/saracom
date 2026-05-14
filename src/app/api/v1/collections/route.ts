import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CollectionService } from "@/services/collection.service";

export async function POST(request: Request) {
  const storeId = "default-store-id";
  const body = await request.json();

  try {
    console.log("Creating collection with data:", JSON.stringify(body, null, 2));
    const collection = await CollectionService.createCollection(storeId, body);
    return NextResponse.json({ data: collection });
  } catch (error: any) {
    console.error("Collection creation error:", error);
    return NextResponse.json({ 
      errors: [error.message],
      stack: error.stack 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const storeId = "default-store-id";
  
  try {
    const collections = await prisma.collection.findMany({
      where: { storeId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ data: collections });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}
