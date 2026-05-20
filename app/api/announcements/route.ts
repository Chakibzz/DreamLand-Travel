import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";

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

    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

