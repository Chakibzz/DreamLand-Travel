import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";
import { requireAdminSession } from "@/lib/server/session";

export async function GET() {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { announcements: true } },
      },
      orderBy: { name: "asc" },
    });

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await request.json().catch(() => null);
    return Response.json({ success: false, message: "Categories verrouillees." }, { status: 403 });
  } catch (error) {
    return handleApiError(error);
  }
}
