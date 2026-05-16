/**
 * ============================================================
 * PÁGINA: page.tsx (Dashboard — Página Inicial)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza a tela inicial (Visão Geral) do sistema, exibindo:
 *  - Alerta de estoque baixo (itens com quantidade <= mínima)
 *  - Cards estatísticos (total de canteiros, ativos, sementeira, colheita)
 *  - Seção de atividade recente
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * - Usa o hook useDashboard para buscar os dados do Supabase
 * - Usa componentes reutilizáveis (StatCard, LowStockAlert, etc.)
 * - Esta é a rota "/" do Next.js (página principal)
 * ============================================================
 */

"use client";

import { Sprout, ShoppingCart, Leaf } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { LowStockAlert } from "@/components/features/dashboard/LowStockAlert";
import { RecentActivity } from "@/components/features/dashboard/RecentActivity";

export default function Dashboard() {
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O hook useDashboard busca os dados do banco automaticamente
  const { loading, lowStockItems, summary } = useDashboard();

  // Enquanto os dados estão sendo carregados, mostra o spinner de loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Título da página */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Visão Geral
        </h1>
      </div>

      {/* Renderiza o alerta vermelho se houver itens com estoque baixo */}
      <LowStockAlert items={lowStockItems} />

      {/* Renderiza os 4 cards de resumo em um grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrado" value={summary.totalCanteiros} icon={Sprout} />
        <StatCard title="Culturas Ativas" value={summary.ativos} icon={Leaf} />
        <StatCard title="Em Sementeira" value={summary.emSementeira} icon={Sprout} />
        <StatCard title="Prontos para Colher" value={summary.aguardandoColheita} icon={ShoppingCart} highlight />
      </div>

      {/* Seção de atividade recente — exibe mensagem contextual */}
      <RecentActivity
        hasCanteiros={summary.totalCanteiros > 0}
        hasLowStock={lowStockItems.length > 0}
      />
    </div>
  );
}
