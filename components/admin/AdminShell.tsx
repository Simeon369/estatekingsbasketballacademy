"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("ek_admin_jwt");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Estate Kings Basketball Academy"
              width={44}
              height={44}
              className="h-10 w-10 object-contain"
              priority
            />
            <span className="font-heading text-lg text-slate-900 hidden sm:inline">Admin</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-slate-900 md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
