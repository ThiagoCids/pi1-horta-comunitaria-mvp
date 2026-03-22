"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sprout, Package, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Canteiros", href: "/canteiros", icon: Sprout },
  { label: "Estoque", href: "/estoque", icon: Package },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-sage-50 text-foreground flex flex-col md:flex-row pb-24 md:pb-0">
      {/* Sidebar for PC */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-sage-700 text-white shadow-lg sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="w-8 h-8 text-sage-100" />
            Horta Comum
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-sage-600 text-white font-bold shadow-sm" : "text-sage-100 hover:bg-sage-600/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-10">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] z-50 flex justify-around items-center h-20 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-sage-800 bg-sage-50 border-t-4 border-sage-600 rounded-t-xl" : "text-gray-400 hover:text-sage-500 border-t-4 border-transparent"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[11px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
