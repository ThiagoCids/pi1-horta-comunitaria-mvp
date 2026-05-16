/**
 * ============================================================
 * COMPONENTE UI: StatCard.tsx (Card de Estatística)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um card de estatística reutilizável com:
 *  - Título (ex: "Total Registrado")
 *  - Valor numérico grande
 *  - Ícone representativo
 *  - Opção de destaque (highlight) para valores importantes
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Usado na página Dashboard para exibir os 4 KPIs principais.
 * ============================================================
 */

import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  highlight?: boolean;
};

export function StatCard({ title, value, icon: Icon, highlight }: StatCardProps) {
  return (
    <div
      className={`rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(21,66,18,0.03)] flex flex-col justify-between ${
        highlight
          ? "bg-sage-600 text-white"
          : "bg-white text-sage-700"
      }`}
    >
      {/* Título do indicador */}
      <h3
        className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${
          highlight ? "text-white/60" : "text-sage-400"
        }`}
      >
        {title}
      </h3>
      {/* Valor numérico com ícone ao lado */}
      <div className="flex items-end justify-between">
        <span className="text-4xl font-black font-manrope tracking-tighter">
          {value}
        </span>
        <Icon
          className={`w-5 h-5 ${
            highlight ? "text-white/30" : "text-sage-300"
          }`}
        />
      </div>
    </div>
  );
}
