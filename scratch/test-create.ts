import prisma from "../src/lib/prisma";
import { ProductService } from "../src/services/product.service";

async function main() {
  const storeId = "default-store-id";
  const data = {
    title: "Test Product",
    description: "Testing product creation",
    status: "active",
    price: "99.99",
    variants: [{
      title: "Default",
      price: "99.99",
      inventoryQty: "10"
    }]
  };

  try {
    const product = await ProductService.createProduct(storeId, data);
    console.log("Success:", product.id);
  } catch (error) {
    console.error("Failure:", error);
  }
}

main();
