/**
 * ============================================================
 * COMPONENTE: LowStockAlert.tsx (Alerta de Estoque Baixo)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um alerta vermelho no Dashboard quando existem itens
 * de estoque com quantidade abaixo do mínimo configurado.
 * Lista cada item em falta com a quantidade atual e ideal.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página Dashboard passa a lista de itens em alerta (do hook useDashboard).
 * Se a lista estiver vazia, o componente não renderiza nada.
 * ============================================================
 */

import { AlertTriangle } from "lucide-react";
import type { EstoqueAlerta } from "@/types";

type LowStockAlertProps = {
  items: EstoqueAlerta[];
};

export function LowStockAlert({ items }: LowStockAlertProps) {
  // Se não há itens em alerta, não renderiza nada
  if (items.length === 0) return null;

  return (
    <div className="bg-[#ffdad6]/40 p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-[#ba1a1a]/10">
      <div className="bg-[#ba1a1a]/10 p-2 rounded-xl">
        <AlertTriangle className="w-6 h-6 text-[#ba1a1a]" />
      </div>
      <div>
        <h3 className="text-[#93000a] font-bold text-lg font-manrope tracking-tight">
          Atenção: Estoque Baixo
        </h3>
        {/* Renderiza a lista de itens em falta */}
        <ul className="mt-2 text-sm text-[#93000a]/80 space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
              <span className="font-bold">{item.item}</span>
              <span className="opacity-75">
                — temos {item.quantidade}
                {item.unidade} (Ideal: {item.quantidade_minima}
                {item.unidade})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
