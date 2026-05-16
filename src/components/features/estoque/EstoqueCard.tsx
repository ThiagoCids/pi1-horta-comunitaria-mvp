/**
 * ============================================================
 * COMPONENTE: EstoqueCard.tsx (Card Visual de Item de Estoque)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um card para cada item de estoque com nome, categoria,
 * quantidade e alerta visual quando o estoque está baixo.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página de Estoque renderiza um EstoqueCard para cada item.
 * Ao clicar no card, abre o formulário de edição via onEdit.
 * ============================================================
 */

import type { EstoqueItem } from "@/types";
import { getCategoryIcon } from "./categoryIcon";

type EstoqueCardProps = {
  item: EstoqueItem;
  onEdit: (item: EstoqueItem) => void;
};

export function EstoqueCard({ item, onEdit }: EstoqueCardProps) {
  return (
    // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Card clicável que abre o formulário de edição
    <button
      type="button"
      onClick={() => onEdit(item)}
      className="group bg-white rounded-[2rem] p-6 shadow-[0_4px_25px_rgba(21,66,18,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 text-left"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-sage-50 p-4 rounded-2xl">
            {getCategoryIcon(item.categoria)}
          </div>
          <div>
            <h3 className="text-2xl font-black font-manrope text-sage-800 tracking-tight leading-tight">
              {item.item}
            </h3>
            <p className="text-sage-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              {item.categoria}
            </p>
          </div>
        </div>

        {/* Badge de alerta — aparece quando quantidade <= mínimo */}
        {item.quantidade <= item.quantidade_minima && (
          <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full animate-pulse border border-[#ffb4ab]">
            Faltando
          </span>
        )}
      </div>

      <div className="flex justify-between items-end border-t border-sage-50/50 pt-5 mt-auto">
        <div>
          <p className="text-[10px] font-bold text-sage-700/60 uppercase tracking-widest mb-1">
            Volume Disponível
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-4xl font-black font-manrope tracking-tighter ${
                item.quantidade <= item.quantidade_minima
                  ? "text-[#ba1a1a]"
                  : "text-sage-700"
              }`}
            >
              {item.quantidade}
            </span>
            <span className="text-sage-500 font-bold">{item.unidade}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
