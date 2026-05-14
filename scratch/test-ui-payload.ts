import prisma from "../src/lib/prisma";
import { ProductService } from "../src/services/product.service";

async function main() {
  const storeId = "default-store-id";
  const data = {
    title: "Basic Product",
    description: "",
    vendor: "Saracom",
    productType: "",
    status: "active",
    price: "0.00",
    compareAtPrice: "",
    inventoryQty: "0",
    sku: "",
    options: [],
    variants: [{
      title: "Default Variant",
      price: "0.00",
      compareAtPrice: "",
      inventoryQty: "0",
      sku: ""
    }],
    media: []
  };

  try {
    const product = await ProductService.createProduct(storeId, data);
    console.log("Success:", product.id);
  } catch (error) {
    console.error("Failure:", error);
  }
}

main();
