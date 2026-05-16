/**
 * ============================================================
 * ARQUIVO: layout.tsx (Layout Raiz da Aplicação)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Este é o layout raiz do Next.js — ele envolve TODAS as páginas
 * do app. Aqui configuramos:
 *  - As fontes Google (Manrope e Inter)
 *  - O CSS global (globals.css)
 *  - O SEO (título e descrição da página)
 *  - O AppShell (sidebar + navbar + conteúdo)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * O Next.js automaticamente injeta o conteúdo de cada página
 * dentro do {children}. Então quando acessamos /canteiros,
 * o Next.js renderiza: Layout > AppShell > Canteiros.
 * ============================================================
 */

import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

// Configuração das fontes do Google Fonts com variáveis CSS
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Metadados para SEO — aparecem na aba do navegador e nos resultados de busca
export const metadata: Metadata = {
  title: "Horta Comum",
  description: "Sistema para gestão de hortas comunitárias e painel de estoque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter bg-background text-foreground">
        {/* O AppShell renderiza o menu lateral e a navbar inferior, envolvendo o conteúdo da página */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
