import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { bookingRequestSchema } from "@/lib/validators/schemas";
import { apiSuccess, handleApiError } from "@/lib/server/api-response";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = bookingRequestSchema.parse(json);

    const created = await prisma.bookingRequest.create({
      data: {
        ...parsed,
        travelers: parsed.adults + parsed.children,
        notes: parsed.notes || null,
      },
    });

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
