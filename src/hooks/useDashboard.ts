/**
 * ============================================================
 * HOOK: useDashboard.ts (Dados da Página Inicial)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Busca os dados necessários para a página inicial (Dashboard):
 *  - Itens de estoque com quantidade abaixo do mínimo (alertas)
 *  - Contagem de canteiros por status (ativos, sementeira, colheita)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página principal (app/page.tsx) importa este hook para
 * exibir os cards de resumo e o alerta de estoque baixo.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { EstoqueAlerta, DashboardSummary } from "@/types";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<EstoqueAlerta[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalCanteiros: 0,
    ativos: 0,
    emSementeira: 0,
    aguardandoColheita: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      // ========================================
      // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
      // READ — Buscamos TODOS os itens de estoque para verificar quais estão em falta
      // ========================================
      const { data: estoque } = await supabase.from("estoque").select("*");
      if (estoque) {
        // Filtramos apenas os itens onde a quantidade atual é menor ou igual à quantidade mínima
        // Esses são os itens que geram o alerta vermelho na tela
        setLowStockItems(
          estoque.filter((item) => item.quantidade <= item.quantidade_minima)
        );
      }

      // ========================================
      // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
      // READ — Buscamos apenas a coluna "status" dos canteiros para montar as estatísticas
      // ========================================
      const { data: canteiros } = await supabase
        .from("canteiros")
        .select("status"); // Só precisamos do status, então otimizamos a consulta

      if (canteiros) {
        // Calculamos os KPIs (indicadores) contando quantos canteiros possuem cada status
        setSummary({
          totalCanteiros: canteiros.length,
          ativos: canteiros.filter(
            (c) => c.status !== "Vazio" && c.status !== "Colhido"
          ).length,
          emSementeira: canteiros.filter((c) => c.status === "Sementeira")
            .length,
          aguardandoColheita: canteiros.filter(
            (c) => c.status === "Aguardando Colheita"
          ).length,
        });
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  return { loading, lowStockItems, summary };
}
