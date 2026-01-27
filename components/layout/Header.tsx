"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, TypesIcon, GamesIcon, AbilitiesIcon } from "@/components/icons";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-center px-4 py-4 relative">
        <Link href="/" className="absolute left-0 flex items-center gap-2 hover:opacity-80 transition">
          <img
            src="/pokeball.png"
            alt="Pokéball"
            className="w-7 h-7 brightness-200 invert"
          />
          <h1 className="text-xl font-bold text-red-500 hidden sm:inline">Manolodex</h1>
        </Link>

        <nav className="flex items-center gap-12">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/")
                ? "text-red-500"
                : "text-slate-300 hover:text-white"
            }`}
            title="Pokémon"
          >
            <HomeIcon />
            <span>Pokémon</span>
          </Link>
          <Link
            href="/tipos"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/tipos")
                ? "text-red-500"
                : "text-slate-300 hover:text-white"
            }`}
            title="Tipos"
          >
            <TypesIcon />
            <span>Tipos</span>
          </Link>
          <Link
            href="/habilidades"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/habilidades")
                ? "text-red-500"
                : "text-slate-300 hover:text-white"
            }`}
            title="Habilidades"
          >
            <AbilitiesIcon />
            <span>Habilidades</span>
          </Link>
          <Link
            href="/minijuegos"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/minijuegos")
                ? "text-red-500"
                : "text-slate-300 hover:text-white"
            }`}
            title="Minijuegos"
          >
            <GamesIcon />
            <span>Minijuegos</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}