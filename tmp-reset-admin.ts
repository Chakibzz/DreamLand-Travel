import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@dreamland-travel.com";
  const password = "Admin@12345";
  const hashed = await hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });

  console.log("Admin password reset OK");
}

main().finally(async () => prisma.$disconnect());
