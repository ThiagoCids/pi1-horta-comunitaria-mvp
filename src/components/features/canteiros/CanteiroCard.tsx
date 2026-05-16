/**
 * ============================================================
 * COMPONENTE: CanteiroCard.tsx (Card Visual de um Canteiro)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um card individual para cada canteiro, mostrando:
 *  - Nome do lote e cultura plantada
 *  - Data de plantio e previsão de colheita
 *  - Badge colorido com o status atual
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página de Canteiros mapeia os dados e renderiza um CanteiroCard
 * para cada registro do banco. Ao clicar no card, abre o formulário
 * de edição via função onEdit (passada como prop pelo pai).
 * ============================================================
 */

import { Sprout, CalendarDays } from "lucide-react";
import type { Canteiro } from "@/types";
import { getStatusColor, formatDate } from "./statusColors";

type CanteiroCardProps = {
  canteiro: Canteiro;
  onEdit: (canteiro: Canteiro) => void;
};

export function CanteiroCard({ canteiro, onEdit }: CanteiroCardProps) {
  return (
    // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O card inteiro é um botão clicável.
    // Ao clicar, chama onEdit(canteiro) que abre o formulário preenchido com os dados deste canteiro.
    <button
      type="button"
      onClick={() => onEdit(canteiro)}
      className="text-left group bg-white rounded-[2rem] p-6 shadow-[0_4px_25px_rgba(21,66,18,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
    >
      {/* Seção superior: nome do lote e cultura */}
      <div className="mb-6 pt-2 text-center">
        <div className="flex justify-center mb-4 px-2 w-full">
          <div className="bg-sage-50 text-sage-600 text-xs font-bold px-4 py-1.5 rounded-xl tracking-widest uppercase text-center line-clamp-2 break-words">
            {canteiro.nome}
          </div>
        </div>
        <h3 className="text-2xl font-black font-manrope text-sage-800 tracking-tight leading-tight">
          {canteiro.cultura || "Lote Vazio"}
        </h3>
      </div>

      {/* Seção inferior: datas e status */}
      <div className="pt-5 mt-auto border-t border-sage-50/50 flex flex-col gap-3">
        {/* Data de plantio */}
        <div className="flex items-center justify-between text-sm text-sage-600/80 font-medium">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-sage-400" />
            <span>D. Plantio</span>
          </div>
          <span className="font-bold text-sage-700">
            {formatDate(canteiro.data_plantio)}
          </span>
        </div>

        {/* Previsão de colheita */}
        <div className="flex items-center justify-between text-sm text-sage-600/80 font-medium">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-sage-400" />
            <span>P. Colheita</span>
          </div>
          <span className="font-bold text-sage-700">
            {formatDate(canteiro.previsao_colheita)}
          </span>
        </div>

        {/* Badge de status com cor dinâmica */}
        <div className="flex justify-center mt-3 pt-3 border-t border-sage-50/50">
          <span
            className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap border ${getStatusColor(
              canteiro.status,
              true
            )}`}
          >
            {canteiro.status}
          </span>
        </div>
      </div>
    </button>
  );
}
