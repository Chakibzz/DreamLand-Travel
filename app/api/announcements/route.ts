import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";

function cleanText(value: string) {
  return value
    .replace(/Ãƒâ€šÃ‚Â·|Ã‚Â·|Â·/g, " · ")
    .replace(/Ãƒâ€š|Ã‚|Â/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanValue(value: unknown): unknown {
  if (typeof value === "string") return cleanText(value);
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanValue(item)]));
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();

    const data = await prisma.announcement.findMany({
      where: category
        ? {
            category: {
              name: {
                equals: category,
                mode: "insensitive",
              },
            },
          }
        : undefined,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(
      data.map((item) => ({
        ...item,
        title: cleanText(item.title),
        description: cleanText(item.description),
        image: cleanText(item.image),
        location: cleanText(item.location),
        tags: item.tags.map(cleanText),
        priceOptions: cleanValue(item.priceOptions),
        richDetails: cleanValue(item.richDetails),
        category: item.category ? { ...item.category, name: cleanText(item.category.name) } : item.category,
      })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
