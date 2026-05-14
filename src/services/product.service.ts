import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ProductService {
  /**
   * Generates a unique handle for a product.
   */
  static async generateHandle(title: string, storeId: string): Promise<string> {
    let handle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let uniqueHandle = handle;
    let counter = 1;

    while (true) {
      const existing = await prisma.product.findUnique({
        where: {
          storeId_handle: {
            storeId,
            handle: uniqueHandle,
          },
        },
      });

      if (!existing) break;
      uniqueHandle = `${handle}-${++counter}`;
    }

    return uniqueHandle;
  }

  static async createProduct(storeId: string, data: any) {
    const { 
      title, 
      description, 
      vendor, 
      productType, 
      tags, 
      status, 
      options, 
      variants, 
      media 
    } = data;

    const handle = await this.generateHandle(title, storeId);

    console.log("Creating product with handle:", handle);
    console.log("Product data payload:", JSON.stringify({
      title, status, optionsCount: options?.length, variantsCount: variants?.length
    }, null, 2));

    try {
      const product = await prisma.product.create({
        data: {
          storeId,
          title,
          handle,
          description,
          vendor,
          productType,
          tags: JSON.stringify(tags || []),
          status: status || "draft",
          options: {
            create: options?.map((opt: any, index: number) => ({
              name: opt.name,
              values: JSON.stringify(opt.values),
              position: index,
            })),
          },
          variants: {
            create: variants?.map((v: any, index: number) => ({
              title: v.title,
              price: parseFloat(v.price) || 0,
              compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
              costPerItem: v.costPerItem ? parseFloat(v.costPerItem) : null,
              sku: v.sku,
              barcode: v.barcode,
              inventoryQty: parseInt(v.inventoryQty) || 0,
              position: index,
            })),
          },
          media: {
            create: media?.map((m: any, index: number) => ({
              url: m.url,
              alt: m.alt,
              type: m.type || "image",
              position: index,
            })),
          },
        },
        include: {
          options: true,
          variants: true,
          media: true,
        },
      });
      console.log("Product created successfully:", product.id);
      return product;
    } catch (dbError: any) {
      console.error("Database error creating product:", dbError);
      throw dbError;
    }
  }

  static async updateProduct(productId: string, data: any) {
    const { 
      title, 
      description, 
      vendor, 
      productType, 
      tags, 
      status, 
      options, 
      variants,
      media
    } = data;

    try {
      // Delete existing options, variants, media and recreate
      await prisma.productOption.deleteMany({ where: { productId } });
      await prisma.productVariant.deleteMany({ where: { productId } });
      await prisma.productMedia.deleteMany({ where: { productId } });

      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          title,
          description,
          vendor,
          productType,
          tags: JSON.stringify(tags || []),
          status: status || "draft",
          options: {
            create: options?.map((opt: any, index: number) => ({
              name: opt.name,
              values: JSON.stringify(opt.values),
              position: index,
            })),
          },
          variants: {
            create: variants?.map((v: any, index: number) => ({
              title: v.title,
              price: parseFloat(v.price) || 0,
              compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
              costPerItem: v.costPerItem ? parseFloat(v.costPerItem) : null,
              sku: v.sku,
              barcode: v.barcode,
              inventoryQty: parseInt(v.inventoryQty) || 0,
              position: index,
            })),
          },
          media: {
            create: media?.map((m: any, index: number) => ({
              url: m.url,
              alt: m.alt,
              type: m.type || "image",
              position: index,
            })),
          },
        },
        include: {
          options: true,
          variants: true,
          media: true,
        },
      });

      console.log("Product updated successfully:", product.id);
      return product;
    } catch (dbError: any) {
      console.error("Database error updating product:", dbError);
      throw dbError;
    }
  }
}
