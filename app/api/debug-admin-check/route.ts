import { NextRequest } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/server/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "");
  const password = String(body.password || "");

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return Response.json({ ok: false, reason: "not_found" });

  const valid = await compare(password, admin.password);
  return Response.json({ ok: true, email: admin.email, valid });
}
