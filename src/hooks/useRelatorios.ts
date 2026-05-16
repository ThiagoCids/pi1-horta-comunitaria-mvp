import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RelatorioKpis, InsumoData, CanteiroData } from "@/types";

export function useRelatorios() {
  const [loading, setLoading] = useState(true);
  const [dataInsumos, setDataInsumos] = useState<InsumoData[]>([]);
  const [dataCanteiros, setDataCanteiros] = useState<CanteiroData[]>([]);
  const [kpis, setKpis] = useState<RelatorioKpis>({
    totalCanteiros: 0,
    canteirosAtivos: 0,
    totalItensEstoque: 0,
    itensEmAlerta: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // === DADOS DE ESTOQUE ===
      const { data: estoque } = await supabase.from("estoque").select("*");
      if (estoque) {
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

        const totalEstoqueVol = Object.values(agrupado).reduce(
          (a, b) => a + b,
          0
        );

        const pieData = Object.keys(agrupado).map((key) => ({
          name: key,
          value: agrupado[key],
          perc:
            totalEstoqueVol > 0
              ? Math.round((agrupado[key] / totalEstoqueVol) * 100)
              : 0,
        }));

        setDataInsumos(pieData);

        const emAlerta = estoque.filter(
          (i) => i.quantidade <= i.quantidade_minima
        ).length;

        setKpis((prev) => ({
          ...prev,
          totalItensEstoque: estoque.length,
          itensEmAlerta: emAlerta,
        }));
      }

      // === DADOS DE CANTEIROS ===
      const { data: canteiros } = await supabase
        .from("canteiros")
        .select("status");
      if (canteiros) {
        const agrupadoCant = canteiros.reduce(
          (acc: Record<string, number>, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          },
          {}
        );

        const totalCant = canteiros.length;
        const barData = Object.keys(agrupadoCant)
          .map((key) => ({
            name: key,
            quantidade: agrupadoCant[key],
            perc:
              totalCant > 0
                ? Math.round((agrupadoCant[key] / totalCant) * 100)
                : 0,
          }))
          .sort((a, b) => b.quantidade - a.quantidade);

        setDataCanteiros(barData);

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
