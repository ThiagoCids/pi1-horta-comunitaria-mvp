/**
 * ============================================================
 * COMPONENTE: AppShell.tsx (Estrutura Visual Global)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza a "casca" visual do aplicativo que aparece em TODAS as páginas:
 *  - Menu lateral (sidebar) no desktop com os links de navegação
 *  - Barra de navegação inferior no mobile (bottom nav)
 *  - Área de conteúdo principal onde as páginas são renderizadas
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * O layout.tsx (raiz do app) envolve todas as páginas com este componente.
 * O Next.js injeta o conteúdo de cada rota no {children}.
 * ============================================================
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sprout, Package, BarChart3 } from "lucide-react";

// Array com os itens de navegação — usado tanto no menu lateral quanto na barra inferior
const navItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Canteiros", href: "/canteiros", icon: Sprout },
  { label: "Estoque", href: "/estoque", icon: Package },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  // usePathname retorna a rota atual (ex: "/canteiros") para destacar o item ativo no menu
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pb-24 md:pb-0">
      {/* ==================== SIDEBAR (Desktop) ====================
          Visível apenas em telas médias e grandes (md:flex).
          Contém o logo e os links de navegação lateral. */}
      <aside className="hidden md:flex flex-col w-72 h-screen bg-sage-50 border-r border-sage-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)] sticky top-0 z-10 transition-all">
        <div className="p-8">
          <h1 className="text-2xl font-black font-manrope text-sage-700 flex items-center gap-3 tracking-tight">
            <div className="bg-sage-600 p-2 rounded-xl text-white shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            Horta Comum
          </h1>
        </div>

        {/* Renderiza os links de navegação no menu lateral */}
        <nav className="flex-1 px-6 space-y-3 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href; // Verifica se este link é a página atual
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
                  isActive
                    ? "bg-white text-sage-700 shadow-sm font-bold"
                    : "text-gray-500 hover:bg-sage-100/50 hover:text-sage-700"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-sage-600" : ""}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ==================== CONTEÚDO PRINCIPAL ====================
          Aqui o Next.js injeta o conteúdo de cada página */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-10">{children}</div>
      </main>

      {/* ==================== BOTTOM NAV (Mobile) ====================
          Visível apenas em telas pequenas (md:hidden).
          Barra fixa na parte inferior com ícones de navegação. */}
      <nav className="md:hidden bg-white fixed bottom-0 left-0 right-0 border-t border-sage-100 z-50 flex justify-around items-center h-20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded-lg ${
                isActive
                  ? "text-sage-700 font-bold"
                  : "text-gray-400 hover:text-sage-500"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${isActive ? "bg-sage-100" : ""}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] tracking-wider uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
