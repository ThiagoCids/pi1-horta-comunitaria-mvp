import type { Metadata } from "next";
// [AULA DE NEXT.JS] 
// A biblioteca next/font/google baixa e otimiza automaticamente as fontes do Google Fonts no servidor.
// Sem chamadas externas que atrasariam o carregamento da nossa interface (FOUC).
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/Layout";

// Configuração da Fonte Manrope (Usada para os Títulos pesados e elegantes)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Configuração da Fonte Inter (A mais limpa para tabelas, números e UI funcional)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// [AULA DE SEO] Metadados preenchem a aba do navegador e como a página aparece no Google/WhatsApp.
export const metadata: Metadata = {
  title: "Horta Comum",
  description: "Sistema para gestão de hortas comunitárias e painel de estoque.",
};

// Layout Raiz: Tudo o que estiver aqui "abraça" as outras páginas (que virão através do {children}).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      // Injetamos as variáveis das fontes localmente na tag HTML.
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter bg-background text-foreground">
        {/* Envolvemos nosso app inteiro no componente de barra lateral (Sidebar) */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
