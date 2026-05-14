const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const theme = await prisma.theme.findFirst();
  console.log(JSON.stringify(theme, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
