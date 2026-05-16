/**
 * ============================================================
 * HOOK: useRelatorios.ts (Dados da Página de Relatórios)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Busca e PROCESSA os dados para a tela de Relatórios:
 *  - KPIs (Total de canteiros, itens em estoque, alertas)
 *  - Dados para o gráfico de pizza (volume por categoria de estoque)
 *  - Dados para o gráfico de barras (ocupação dos canteiros por status)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página /relatorios/page.tsx importa este hook e passa os
 * dados processados para os componentes KpiCards, VolumeChart
 * e CapacityBars, que renderizam os gráficos visuais.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RelatorioKpis, InsumoData, CanteiroData } from "@/types";

export function useRelatorios() {
  const [loading, setLoading] = useState(true);
  const [dataInsumos, setDataInsumos] = useState<InsumoData[]>([]);     // Dados para o gráfico de pizza
  const [dataCanteiros, setDataCanteiros] = useState<CanteiroData[]>([]); // Dados para as barras horizontais
  const [kpis, setKpis] = useState<RelatorioKpis>({
    totalCanteiros: 0,
    canteirosAtivos: 0,
    totalItensEstoque: 0,
    itensEmAlerta: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ========================================
      // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
      // PROCESSAMENTO DE ESTOQUE — Agrupa os itens por categoria e calcula percentuais
      // ========================================
      const { data: estoque } = await supabase.from("estoque").select("*");
      if (estoque) {
        // Agrupamos todos os itens de estoque por categoria (Semente, Insumo, Ferramenta)
        // somando a quantidade de cada um. Ex: { Semente: 50, Insumo: 120, Ferramenta: 30 }
        const agrupado = estoque.reduce(
          (acc: Record<string, number>, item) => {
            if (Number(item.quantidade) > 0) {
              acc[item.categoria] =
                (acc[item.categoria] || 0) + Number(item.quantidade);
            }
            return acc;
          },
          {}
        );

        // Calculamos o volume total para depois calcular os percentuais
        const totalEstoqueVol = Object.values(agrupado).reduce(
          (a, b) => a + b,
          0
        );

        // Transformamos o objeto agrupado em um array que o gráfico de pizza (Recharts) entende
        const pieData = Object.keys(agrupado).map((key) => ({
          name: key,
          value: agrupado[key],
          perc:
            totalEstoqueVol > 0
              ? Math.round((agrupado[key] / totalEstoqueVol) * 100)
              : 0,
        }));

        setDataInsumos(pieData);

        // Contamos quantos itens estão em alerta (quantidade <= mínimo)
        const emAlerta = estoque.filter(
          (i) => i.quantidade <= i.quantidade_minima
        ).length;

        setKpis((prev) => ({
          ...prev,
          totalItensEstoque: estoque.length,
          itensEmAlerta: emAlerta,
        }));
      }

      // ========================================
      // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
      // PROCESSAMENTO DE CANTEIROS — Agrupa por status e calcula percentuais para as barras
      // ========================================
      const { data: canteiros } = await supabase
        .from("canteiros")
        .select("status");
      if (canteiros) {
        // Agrupamos os canteiros por status. Ex: { "Em Desenvolvimento": 3, "Vazio": 2 }
        const agrupadoCant = canteiros.reduce(
          (acc: Record<string, number>, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          },
          {}
        );

        const totalCant = canteiros.length;

        // Transformamos em array e calculamos o percentual de cada status
        const barData = Object.keys(agrupadoCant)
          .map((key) => ({
            name: key,
            quantidade: agrupadoCant[key],
            perc:
              totalCant > 0
                ? Math.round((agrupadoCant[key] / totalCant) * 100)
                : 0,
          }))
          .sort((a, b) => b.quantidade - a.quantidade); // Ordena do maior para o menor

        setDataCanteiros(barData);

        // Canteiros "ativos" são todos que não estão "Vazios"
        const ativos = canteiros.filter((c) => c.status !== "Vazio").length;
        setKpis((prev) => ({
          ...prev,
          totalCanteiros: totalCant,
          canteirosAtivos: ativos,
        }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return { loading, dataInsumos, dataCanteiros, kpis };
}
