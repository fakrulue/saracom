const Prisma = require("@prisma/client");

const prisma = new Prisma.PrismaClient({
  datasource: {
    url: "file:./dev.db"
  }
});

async function main() {
  const store = await prisma.store.upsert({
    where: { id: "default-store-id" },
    update: {},
    create: {
      id: "default-store-id",
      name: "Saracom Demo Store",
    },
  });

  const products = [
    { title: "Classic White Tee", vendor: "Saracom", productType: "Apparel", tags: "['summer', 'basic']" },
    { title: "Denim Jacket", vendor: "Saracom", productType: "Apparel", tags: "['winter', 'outerwear']" },
    { title: "Leather Boots", vendor: "Footwear Co", productType: "Shoes", tags: "['leather', 'premium']" },
    { title: "Wireless Headphones", vendor: "TechGear", productType: "Electronics", tags: "['audio', 'wireless']" },
    { title: "Silk Scarf", vendor: "Saracom", productType: "Accessories", tags: "['summer', 'silk']" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { 
        storeId_handle: { 
          storeId: store.id, 
          handle: p.title.toLowerCase().replace(/ /g, "-") 
        } 
      },
      update: {},
      create: {
        ...p,
        storeId: store.id,
        handle: p.title.toLowerCase().replace(/ /g, "-"),
      },
    });
  }

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
