"use client";

import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin-login" })}
      className="rounded-md border border-[#5f4722] bg-[#16110a] px-3 py-1.5 text-[12px] font-bold text-[#d6c29a] hover:border-[#a97b32] hover:text-[#c89a4b]"
    >
      Se deconnecter
    </button>
  );
}

