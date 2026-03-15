"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Theater, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login logic
    alert("Welcome to KOPIS Arts!");
    router.push("/");
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div
        className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-xl mb-4">
            <Theater size={32} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">KOPIS Login</h1>
          <p className="text-[var(--text-secondary)] font-medium">관리자 계정으로 로그인하세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} aria-hidden="true" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-bold"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} aria-hidden="true" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--accent-primary)] text-white font-black shadow-lg hover:opacity-90 transition-opacity mt-4 group"
          >
            Log In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
            공연 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
