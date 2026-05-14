const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const config = JSON.stringify({ test: "data" });
  const theme = await prisma.theme.create({
    data: { config }
  });
  console.log("Created theme:", theme);
}

main().catch(console.error).finally(() => prisma.$disconnect());
