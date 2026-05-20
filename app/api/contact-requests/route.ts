import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { contactRequestSchema } from "@/lib/validators/schemas";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = contactRequestSchema.parse(json);

    const created = await prisma.contactRequest.create({
      data: {
        ...parsed,
        phone: parsed.phone || null,
      },
    });

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
