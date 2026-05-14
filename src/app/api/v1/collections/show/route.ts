import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ errors: ["Handle is required"] }, { status: 400 });
  }

  try {
    let collectionProducts: any[] = [];

    if (handle === "all") {
      const allProducts = await prisma.product.findMany({
        where: { storeId: "default-store-id" },
        include: { variants: true, options: true, media: true },
        orderBy: { createdAt: "desc" },
      });
      collectionProducts = allProducts.map(p => ({
        id: p.id,
        handle: p.handle,
        title: p.title,
        description: p.description,
        vendor: p.vendor,
        productType: p.productType,
        status: p.status,
        price: p.variants[0]?.price ?? 0,
        compare_at_price: p.variants[0]?.compareAtPrice ?? null,
        image_urls: p.media.map(m => m.url),
        is_new: p.title.toLowerCase().includes("new") || p.title.toLowerCase().includes("baby"),
        is_sale: p.title.toLowerCase().includes("sale") || p.title.toLowerCase().includes("discount"),
        is_best_seller: false,
        rating: 4.5,
        stock: p.variants.reduce((acc: number, v: any) => acc + v.inventoryQty, 0),
      }));
    } else {
      const collection = await prisma.collection.findFirst({
        where: {
          storeId: "default-store-id",
          handle: handle,
        },
        include: {
          products: {
            include: {
              product: {
                include: {
                  variants: true,
                  media: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      });

      if (!collection) {
        return NextResponse.json({ errors: ["Collection not found"] }, { status: 404 });
      }

      collectionProducts = collection.products.map(cp => ({
        id: cp.product.id,
        handle: cp.product.handle,
        title: cp.product.title,
        description: cp.product.description,
        vendor: cp.product.vendor,
        productType: cp.product.productType,
        status: cp.product.status,
        price: cp.product.variants[0]?.price ?? 0,
        compare_at_price: cp.product.variants[0]?.compareAtPrice ?? null,
        image_urls: cp.product.media.map(m => m.url),
        is_new: cp.product.title.toLowerCase().includes("new") || cp.product.title.toLowerCase().includes("baby"),
        is_sale: cp.product.title.toLowerCase().includes("sale") || cp.product.title.toLowerCase().includes("discount"),
        is_best_seller: false,
        rating: 4.5,
        stock: cp.product.variants.reduce((acc: number, v: any) => acc + v.inventoryQty, 0),
      }));
    }

    return NextResponse.json({ data: collectionProducts });
  } catch (error: any) {
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}