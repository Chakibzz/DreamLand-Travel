import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/server/session";
import { apiError, apiSuccess, handleApiError } from "@/lib/server/api-response";

const uploadDir = join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) return apiError("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return apiError("Fichier manquant", 400);
    if (!file.type.startsWith("image/")) return apiError("Format image invalide", 400);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${randomUUID()}.${ext}`;

    await mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(join(uploadDir, filename), buffer);

    return apiSuccess({ url: `/uploads/${filename}` }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");
    if (!imageUrl || !imageUrl.startsWith("/uploads/")) return apiError("URL image invalide", 400);

    const fullPath = join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
    await unlink(fullPath);

    return apiSuccess({ deleted: imageUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
