import { NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const storeId = "default-store-id";

  try {
    const where: any = { storeId };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { vendor: { contains: search, mode: "insensitive" } },
        { productType: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        options: true,
        media: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ data: products });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const storeId = "default-store-id"; // Placeholder until auth is implemented
  const body = await request.json();

  try {
    const product = await ProductService.createProduct(storeId, body);
    return NextResponse.json({ data: product });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ 
      errors: [error.message],
      stack: error.stack
    }, { status: 500 });
  }
}
