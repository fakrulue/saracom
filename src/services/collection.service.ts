import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CollectionService {
  /**
   * Generates a unique handle for a collection within a store.
   */
  static async generateHandle(title: string, storeId: string): Promise<string> {
    let handle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let uniqueHandle = handle;
    let counter = 1;

    while (true) {
      const existing = await prisma.collection.findUnique({
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

  /**
   * Syncs products for a smart collection based on its rules.
   */
  static async syncSmartCollection(collectionId: string) {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        rules: {
          include: {
            conditions: true,
          },
        },
      },
    });

    if (!collection || collection.collectionType !== "smart" || !collection.rules) {
      return;
    }

    const { matchAll, conditions } = collection.rules;

    // Build the Prisma query filter
    const productFilters: Prisma.ProductWhereInput[] = conditions.map((condition) => {
      const { field, operator, value } = condition;
      
      // Mapping fields to Prisma filter logic
      switch (field) {
        case "title":
          return this.getTextFilter("title", operator, value);
        case "vendor":
          return this.getTextFilter("vendor", operator, value);
        case "type":
        case "productType":
          return this.getTextFilter("productType", operator, value);
        case "tag":
          return { tags: { contains: value } };
        case "price":
          return { variants: { some: { price: this.getNumberFilter(operator, value) } } };
        case "compare_at_price":
          return { variants: { some: { compareAtPrice: this.getNumberFilter(operator, value) } } };
        case "weight":
          return { variants: { some: { weight: this.getNumberFilter(operator, value) } } };
        case "stock":
          return { variants: { some: { inventoryQty: this.getNumberFilter(operator, value) } } };
        case "variant_title":
          return { variants: { some: { title: this.getTextFilter("title", operator, value).title } } };
        default:
          return {};
      }
    });

    const where: Prisma.ProductWhereInput = {
      storeId: collection.storeId,
      [matchAll ? "AND" : "OR"]: productFilters,
    };

    console.log("Syncing smart collection. Query:", JSON.stringify(where, null, 2));

    const matchingProducts = await prisma.product.findMany({
      where,
      select: { id: true },
    });

    console.log(`Found ${matchingProducts.length} matching products.`);

    const transactions: any[] = [
      prisma.collectionProduct.deleteMany({
        where: { collectionId },
      }),
    ];

    if (matchingProducts.length > 0) {
      transactions.push(
        prisma.collectionProduct.createMany({
          data: matchingProducts.map((p, index) => ({
            collectionId,
            productId: p.id,
            position: index,
          })),
        })
      );
    }

    transactions.push(
      prisma.collection.update({
        where: { id: collectionId },
        data: { updatedAt: new Date() },
      })
    );

    await prisma.$transaction(transactions);
  }

  private static getTextFilter(field: string, operator: string, value: string): any {
    switch (operator) {
      case "equals":
        return { [field]: { equals: value, mode: "insensitive" } };
      case "not_equals":
        return { [field]: { not: value } };
      case "contains":
        return { [field]: { contains: value, mode: "insensitive" } };
      case "not_contains":
        return { [field]: { not: { contains: value } } };
      case "starts_with":
        return { [field]: { startsWith: value, mode: "insensitive" } };
      case "ends_with":
        return { [field]: { endsWith: value, mode: "insensitive" } };
      default:
        return {};
    }
  }

  private static getNumberFilter(operator: string, value: string): any {
    const num = parseFloat(value);
    if (isNaN(num)) return {};

    switch (operator) {
      case "equals":
        return { equals: num };
      case "not_equals":
        return { not: num };
      case "greater_than":
        return { gt: num };
      case "less_than":
        return { lt: num };
      default:
        return {};
    }
  }

  static async createCollection(storeId: string, data: any) {
    const { title, collectionType, rules, products, ...rest } = data;

    const handle = await this.generateHandle(title, storeId);

    const collection = await prisma.collection.create({
      data: {
        ...rest,
        title,
        handle,
        storeId,
        collectionType,
        rules: collectionType === "smart" ? {
          create: {
            matchAll: rules.matchAll,
            conditions: {
              create: rules.conditions.map((c: any, index: number) => ({
                ...c,
                position: index,
              })),
            },
          },
        } : undefined,
      },
    });

    if (collectionType === "manual" && products && products.length > 0) {
      await prisma.collectionProduct.createMany({
        data: products.map((productId: string, index: number) => ({
          collectionId: collection.id,
          productId,
          position: index,
        })),
      });
    } else if (collectionType === "manual") {
      // Even if products array is empty or not provided, ensure we have no products
      await prisma.collectionProduct.deleteMany({
        where: { collectionId: collection.id },
      });
    }

    if (collectionType === "smart") {
      try {
        await this.syncSmartCollection(collection.id);
      } catch (error) {
        console.error("Initial sync failed for smart collection:", error);
      }
    }

    return prisma.collection.findUnique({
      where: { id: collection.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async updateCollection(id: string, data: any) {
    const { title, collectionType, rules, products, ...rest } = data;

    const updateData: Prisma.CollectionUpdateInput = {
      ...rest,
      title,
    };

    if (collectionType === "smart" && rules) {
      // Delete existing rules and create new ones
      await prisma.collectionRuleCondition.deleteMany({
        where: { rule: { collectionId: id } },
      });
      await prisma.collectionRule.deleteMany({
        where: { collectionId: id },
      });

      await prisma.collectionRule.create({
        data: {
          collectionId: id,
          matchAll: rules.matchAll,
          conditions: {
            create: rules.conditions.map((c: any, index: number) => ({
              ...c,
              position: index,
            })),
          },
        },
      });
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
    });

    // Handle manual product updates
    if (collectionType === "manual" && products) {
      await this.updateCollectionProducts(id, products);
    }

    if (collectionType === "smart") {
      await this.syncSmartCollection(collection.id);
    }

    return prisma.collection.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  static async updateCollectionProducts(collectionId: string, productIds: string[]) {
    // Delete existing products
    await prisma.collectionProduct.deleteMany({
      where: { collectionId },
    });

    // Add new products
    if (productIds.length > 0) {
      await prisma.collectionProduct.createMany({
        data: productIds.map((productId, index) => ({
          collectionId,
          productId,
          position: index,
        })),
      });
    }

    return prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        _count: { select: { products: true } },
      },
    });
  }
}
