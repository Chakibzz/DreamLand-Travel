import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server/auth";

export async function requireAdminSession() {
  return getServerSession(authOptions);
}
