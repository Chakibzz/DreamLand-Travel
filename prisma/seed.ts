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

  const announcements = [
    {
      title: "Circuit Tassili Premium",
      description: "Circuit organise de 7 jours avec guide local, transport et hebergement inclus.",
      price: 198000,
      image: "/upscaled/2e3467b739eb.jpg",
      location: "Tamanrasset, Algerie",
      category: "Voyages organises",
    },
    {
      title: "Omra Confort 10 jours",
      description: "Pack Omra avec assistance complete, hebergement proche Haram et suivi avant depart.",
      price: 289000,
      image: "/upscaled/83a4543bcba0.jpg",
      location: "Makkah - Madinah",
      category: "Omra",
    },
    {
      title: "Billet Alger -> Istanbul",
      description: "Billets flexibles avec options bagages et accompagnement dossier voyage.",
      price: 87000,
      image: "/upscaled/d5178bc52af5.jpg",
      location: "Depart Alger",
      category: "Billetterie",
    },
    {
      title: "Transfert Aeroport - Hotel",
      description: "Service transfert prive 24/7 avec chauffeur professionnel et ponctualite garantie.",
      price: 12000,
      image: "/upscaled/7d5879b3811b.jpg",
      location: "Alger",
      category: "Transfert",
    },
    {
      title: "E-Visa Canada",
      description: "Accompagnement complet pour votre dossier e-visa, verification et suivi jusqu'a obtention.",
      price: 32000,
      image: "/upscaled/f8778c920608.jpg",
      location: "Service international",
      category: "Services Visa",
    },
    {
      title: "Sejour a la carte Mediterranee",
      description: "Programme personnalise selon vos dates, votre budget et le nombre de voyageurs.",
      price: 156000,
      image: "/upscaled/31df43bda50b.jpg",
      location: "Algerie Cotiere",
      category: "Sejour a la carte",
    },
  ];

  for (const item of announcements) {
    const categoryId = categoryMap.get(item.category);
    if (!categoryId) continue;
    await prisma.announcement.create({
      data: {
        title: item.title,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        description: item.description,
        price: item.price,
        image: item.image,
        location: item.location,
        categoryId,
      },
    });
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
