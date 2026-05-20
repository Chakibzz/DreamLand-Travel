"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    setLoading(false);
    if (!res || res.error) {
      setError(res?.error ? `Connexion echouee: ${res.error}` : "Identifiants invalides.");
      return;
    }

    router.push(res.url || "/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#f3f4fb] pt-24">
      <div className="container-max mx-auto px-4 md:px-10">
        <div className="mx-auto max-w-md rounded-2xl border border-[#3b2b16] bg-[#12100c] p-6 shadow-sm">
          <h1 className="text-[34px] font-semibold text-[#c89a4b]">Connexion admin</h1>
          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-lg border border-[#5b4526] px-3 py-2 text-[13px]" required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="w-full rounded-lg border border-[#5b4526] px-3 py-2 text-[13px]" required />
            <button disabled={loading} className="w-full rounded-lg bg-[#a97b32] py-2.5 text-[12px] font-bold text-white">{loading ? "Connexion..." : "Se connecter"}</button>
            {error ? <p className="text-[12px] text-[#ba1a1a]">{error}</p> : null}
          </form>
        </div>
      </div>
    </main>
  );
}


