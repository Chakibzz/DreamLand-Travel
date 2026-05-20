import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { announcementSchema } from "@/lib/validators/schemas";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";
import { requireAdminSession } from "@/lib/server/session";
import { toSlug } from "@/lib/server/slug";

export async function GET() {
  try {
    const data = await prisma.announcement.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const json = await request.json();
    const parsed = announcementSchema.parse(json);

    const baseSlug = toSlug(parsed.title);
    let slug = baseSlug;
    let i = 1;

    while (await prisma.announcement.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const created = await prisma.announcement.create({
      data: {
        ...parsed,
        slug,
      },
      include: { category: true },
    });

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
