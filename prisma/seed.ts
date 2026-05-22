import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@dreamland-travel.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const hashed = await hash(password, 12);

  // Reset de base coherent avec la refonte
  await prisma.bookingRequest.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.category.deleteMany();

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed },
  });

  const categories = ["Voyages organises", "Omra", "Billetterie", "Transfert", "Services Visa", "Sejour a la carte"];
  const categoryMap = new Map<string, string>();

  for (const name of categories) {
    const c = await prisma.category.create({ data: { name } });
    categoryMap.set(name, c.id);
  }

  console.log("Seed termine avec succes.");
  console.log(`Admin: ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("Mot de passe par defaut utilise: ChangeMe123!");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
