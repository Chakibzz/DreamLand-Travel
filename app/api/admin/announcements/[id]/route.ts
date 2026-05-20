import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { announcementSchema } from "@/lib/validators/schemas";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";
import { requireAdminSession } from "@/lib/server/session";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const json = await request.json();
    const parsed = announcementSchema.parse(json);

    const updated = await prisma.announcement.update({
      where: { id },
      data: parsed,
      include: { category: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.announcement.delete({ where: { id } });
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
