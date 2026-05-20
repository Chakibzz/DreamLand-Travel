import { NextRequest } from "next/server";
import { bookingStatusSchema } from "@/lib/validators/schemas";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";
import { requireAdminSession } from "@/lib/server/session";
import { prisma } from "@/lib/server/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const json = await request.json();
    const parsed = bookingStatusSchema.parse(json);

    const updated = await prisma.bookingRequest.update({ where: { id }, data: parsed });
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
