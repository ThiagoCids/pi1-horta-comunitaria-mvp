/**
 * ============================================================
 * COMPONENTE: VolumeChart.tsx (Gráfico de Pizza — Estoque)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um gráfico de pizza (donut chart) usando a biblioteca
 * Recharts, mostrando a distribuição percentual do estoque por
 * categoria (Sementes, Insumos, Ferramentas).
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página de Relatórios passa os dados processados pelo hook
 * useRelatorios (que agrupa e calcula os percentuais).
 * ============================================================
 */

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { InsumoData } from "@/types";

// Paleta de cores temáticas para as fatias do gráfico
const BOTANICAL_COLORS = [
  "#137333",  // Verde escuro
  "#0369a1",  // Azul
  "#92400e",  // Marrom
  "#8c5a2b",  // Terra
  "#475569",  // Cinza
];

type VolumeChartProps = {
  data: InsumoData[];
};

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_2px_15px_rgba(21,66,18,0.03)]">
      <h2 className="text-xl font-bold text-sage-800 mb-2">
        Volume por Categoria (Estoque)
      </h2>
      <p className="text-xs text-sage-500 mb-8 max-w-[500px] leading-relaxed">
        Distribuição volumétrica baseada no inventário atual de sementes,
        ferramentas e insumos orgânicos.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Legenda lateral — lista cada categoria com cor e percentual */}
        <div className="flex-1 space-y-3 w-full">
          {data.length > 0 ? (
            data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      BOTANICAL_COLORS[index % BOTANICAL_COLORS.length],
                  }}
                ></div>
                <div className="text-sm font-medium text-sage-600 flex-1">
                  {entry.name}{" "}
                  <span className="text-sage-400">({entry.perc}%)</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sage-400 text-sm italic">
              Nenhum item em estoque.
            </div>
          )}
        </div>

        {/* Gráfico de pizza (donut) — renderizado pela biblioteca Recharts */}
        <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] flex-shrink-0">
          {data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={4}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          BOTANICAL_COLORS[index % BOTANICAL_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Texto centralizado dentro do donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[22px] lg:text-2xl font-black text-sage-800">
                  100%
                </span>
                <span className="text-[10px] font-bold text-sage-400 tracking-wider">
                  TOTAL
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full rounded-full border-[20px] border-sage-50"></div>
          )}
        </div>
      </div>
    </div>
  );
}
