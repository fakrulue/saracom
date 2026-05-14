const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.theme.deleteMany();
  console.log("Deleted all theme records");
  const config = JSON.stringify({
    colors: {
      primary: "#ec4899",
      accent: "#10b981",
      background: "#ffffff",
      text: "#0f172a",
      secondaryBg: "#f8fafc"
    },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      headingSize: "48",
      bodySize: "16"
    },
    logo: {
      text: "Saracom",
      showTagline: true,
      width: 140,
      imageUrl: null
    },
    sections: {
      categories: {
        enabled: true,
        title: "Categories",
        subtitle: "Shop by style",
        columns: 6,
        collections: []
      }
    }
  });
  const created = await prisma.theme.create({
    data: { config }
  });
  console.log("Re-initialized theme:", created.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
