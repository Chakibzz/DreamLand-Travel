import { prisma } from "@/lib/server/prisma";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";
import { requireAdminSession } from "@/lib/server/session";

export async function GET() {
  try {
    const session = await requireAdminSession();
    if (!session) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const data = await prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
