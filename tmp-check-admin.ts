import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany({ select: { id: true, email: true, createdAt: true } });
  console.log(admins);
}

main().finally(async () => prisma.$disconnect());
