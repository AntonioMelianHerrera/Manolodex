"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, TypesIcon, GamesIcon } from "@/components/icons";

export default function FloatingCircles() {
  const pathname = usePathname();

  const navItems = [
    { icon: HomeIcon, label: "Inicio", href: "/" },
    { icon: TypesIcon, label: "Tipos", href: "/tipos" },
    { icon: GamesIcon, label: "Minijuegos", href: "/minijuegos" },
  ];

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-30 hidden md:flex flex-col gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              pathname === item.href
                ? "bg-red-600 shadow-lg shadow-red-600/50 scale-110 text-white"
                : "bg-slate-800 shadow-lg shadow-slate-900/50 hover:bg-slate-700 hover:shadow-red-600/30 text-slate-300"
            }`}
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}
