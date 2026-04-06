"use client";

// [AULA DE NEXT.JS]
// O "use client" diz ao Next.js que este componente usa coisas que só existem no navegador do usuário,
// como o 'usePathname' (para saber a URL atual) e interações de estado. Sem isso, ele tentaria rodar apenas no servidor.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sprout, Package, BarChart3 } from "lucide-react";

// Array centralizando as opções do menu. Se precisar adicionar uma nova tela, basta adicionar aqui!
const navItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Canteiros", href: "/canteiros", icon: Sprout },
  { label: "Estoque", href: "/estoque", icon: Package },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Esse hook capta em qual URL estamos no momento (ex: "/estoque")
  const pathname = usePathname();

  return (
    // [AULA DE UI/UX] O 'bg-background' busca da nossa variável CSS. Configuramos para ser o #f8faf8 (papel sutil).
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pb-24 md:pb-0">
      
      {/* 
        ======== BARRA LATERAL (Desktop) ======== 
        Oculta no celular ('hidden md:flex').
        Note que usamos 'bg-sage-50' em vez de uma cor forte, criando um tom sobre tom elegentíssimo com o fundo.
      */}
      <aside className="hidden md:flex flex-col w-72 h-screen bg-sage-50 border-r border-sage-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)] sticky top-0 z-10 transition-all">
        <div className="p-8">
          {/* A fonte Manrope está ativa via 'font-manrope' para os títulos */}
          <h1 className="text-2xl font-black font-manrope text-sage-700 flex items-center gap-3 tracking-tight">
            <div className="bg-sage-600 p-2 rounded-xl text-white shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            Horta Comum
          </h1>
        </div>
        
        {/* Usamos flex-1 para empurrar conteúdo inferior caso precise, e px-6 para espaçamento generoso */}
        <nav className="flex-1 px-6 space-y-3 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Se o href do item for o mesmo que a URL atual, ele está 'ativo'.
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                // [AULA DE UI/UX] Sem bordas! Apenas trocamos a cor de fundo (surface-container) ao ativar
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                  ? "bg-white text-sage-700 shadow-sm font-bold" // Card flutuante branco para pino ativo
                  : "text-gray-500 hover:bg-sage-100/50 hover:text-sage-700"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-sage-600" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 
        ======== CONTEÚDO PRINCIPAL ======== 
        Onde cada página ('children') é renderizada.
      */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-10">
          {children}
        </div>
      </main>

      {/* 
        ======== BARRA INFERIOR (Mobile) ======== 
        Aparece apenas nas telas de celular (ajudando os voluntários em campo).
        Usamos glass-panel (declarado no globals.css) para um blur flutuante por cima do conteúdo.
      */}
      <nav className="md:hidden bg-white fixed bottom-0 left-0 right-0 border-t border-sage-100 z-50 flex justify-around items-center h-20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? "text-sage-700 font-bold" : "text-gray-400 hover:text-sage-500"
              }`}
            >
              {/* O Ícone ganha um fundo verde apenas quando ativo no mobile */}
              <div className={`p-1.5 rounded-lg ${isActive ? "bg-sage-100" : ""}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
