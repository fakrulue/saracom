import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const storeId = "default-store-id";
  const { matchAll, conditions } = await request.json();

  try {
    // This logic should probably be in CollectionService too
    const productFilters: any[] = conditions.map((condition: any) => {
      const { field, operator, value } = condition;
      
      switch (field) {
        case "title":
          return { title: { contains: value } };
        case "vendor":
          return { vendor: { contains: value } };
        case "productType":
          return { productType: { contains: value } };
        case "tag":
          return { tags: { contains: value } }; // JSON string search for now
        default:
          return {};
      }
    });

    const where = {
      storeId,
      [matchAll ? "AND" : "OR"]: productFilters,
    };

    const products = await prisma.product.findMany({
      where,
      take: 50,
    });

    return NextResponse.json({ data: products });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}
