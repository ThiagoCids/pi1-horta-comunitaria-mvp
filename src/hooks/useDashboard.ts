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

      const { data: estoque } = await supabase.from("estoque").select("*");
      if (estoque) {
        setLowStockItems(
          estoque.filter((item) => item.quantidade <= item.quantidade_minima)
        );
      }

      const { data: canteiros } = await supabase
        .from("canteiros")
        .select("status");
      if (canteiros) {
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
