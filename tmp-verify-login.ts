import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@dreamland-travel.com";
  const password = "Admin@12345";

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    console.log("ADMIN_NOT_FOUND");
    return;
  }

  const ok = await compare(password, admin.password);
  console.log({ email: admin.email, compareOk: ok, hashPreview: admin.password.slice(0, 12) });
}

main().finally(async () => prisma.$disconnect());
