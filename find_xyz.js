process.env.DATABASE_URL = "mysql://root:Raj%409315153604bca@localhost:3306/hostelsdudes_db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  console.log("--- CHECKING DB ---");
  const dbPgs = await prisma.pG.findMany();
  console.log("DB count:", dbPgs.length);
  console.log("DB PGs:", dbPgs.map(p => ({ id: p.id, name: p.name, status: p.status })));

  console.log("\n--- CHECKING custom_pgs.json ---");
  const jsonContent = JSON.parse(fs.readFileSync('./src/data/custom_pgs.json', 'utf8'));
  console.log("JSON count:", jsonContent.length);
  console.log("JSON PGs:", jsonContent.map(p => ({ id: p.id, name: p.name })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
