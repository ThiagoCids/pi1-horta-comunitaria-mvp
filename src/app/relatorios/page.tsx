/**
 * ============================================================
 * PÁGINA: relatorios/page.tsx (Relatórios e Gráficos)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza a tela de Relatórios com visualizações gráficas:
 *  - KPIs (cards com números-chave do sistema)
 *  - Gráfico de pizza (distribuição do estoque por categoria)
 *  - Gráfico de barras horizontais (ocupação dos canteiros por status)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * - Usa o hook useRelatorios para buscar e processar dados
 * - Os componentes KpiCards, VolumeChart e CapacityBars renderizam
 *   os dados usando a biblioteca Recharts para gráficos
 * - Esta é a rota "/relatorios" do Next.js
 * ============================================================
 */

"use client";

import { useRelatorios } from "@/hooks/useRelatorios";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { KpiCards } from "@/components/features/relatorios/KpiCards";
import { VolumeChart } from "@/components/features/relatorios/VolumeChart";
import { CapacityBars } from "@/components/features/relatorios/CapacityBars";

export default function Relatorios() {
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O hook useRelatorios busca dados e processa gráficos automaticamente
  const { loading, dataInsumos, dataCanteiros, kpis } = useRelatorios();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho da página de relatórios */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black font-manrope text-sage-800 tracking-tight mb-2">
          Visão Geral
        </h1>
        <p className="text-sm font-medium text-sage-500">
          Desempenho e saúde do ecossistema botânico em tempo real.
        </p>
      </div>

      {/* Cards com os KPIs (indicadores-chave) — total de canteiros, ativos, estoque, alertas */}
      <KpiCards kpis={kpis} />

      {/* Gráfico de pizza — mostra a distribuição volumétrica do estoque por categoria */}
      <VolumeChart data={dataInsumos} />

      {/* Barras horizontais — mostra a ocupação dos canteiros agrupados por status */}
      <CapacityBars data={dataCanteiros} />
    </div>
  );
}
