import prisma from "../src/lib/prisma";

async function main() {
  const stores = await prisma.store.findMany();
  console.log("Existing stores:", stores);
  
  if (stores.length === 0) {
    console.log("No stores found! Creating default store...");
    const store = await prisma.store.create({
      data: {
        id: "default-store-id",
        name: "Saracom Demo Store",
      }
    });
    console.log("Store created:", store);
  }
}

main();
