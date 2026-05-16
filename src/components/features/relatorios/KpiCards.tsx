import { Sprout, Leaf, PackageSearch, AlertTriangle } from "lucide-react";
import type { RelatorioKpis } from "@/types";

type KpiCardsProps = {
  kpis: RelatorioKpis;
};

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
        <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
          Total de Canteiros
        </h3>
        <div className="flex items-end gap-2 mt-auto">
          <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">
            {kpis.totalCanteiros}
          </p>
          <div className="text-sage-300 mb-1.5">
            <Sprout className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
        <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
          Canteiros Ativos
        </h3>
        <div className="flex items-end gap-2 mt-auto">
          <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">
            {kpis.canteirosAtivos}
          </p>
          <div className="text-sage-300 mb-1.5">
            <Leaf className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
        <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
          Itens no Estoque
        </h3>
        <div className="flex items-end gap-2 mt-auto">
          <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">
            {kpis.totalItensEstoque}
          </p>
          <div className="text-sage-300 mb-1.5">
            <PackageSearch className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div
        className={`rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px] ${
          kpis.itensEmAlerta > 0 ? "bg-[#ffdad6]" : "bg-white"
        }`}
      >
        <h3
          className={`text-[10px] font-bold uppercase tracking-widest ${
            kpis.itensEmAlerta > 0 ? "text-[#ba1a1a]" : "text-sage-400"
          }`}
        >
          Itens em Alerta
        </h3>
        <div className="flex items-end gap-2 mt-auto">
          <p
            className={`text-[2.75rem] font-black font-manrope leading-none ${
              kpis.itensEmAlerta > 0 ? "text-[#93000a]" : "text-sage-800"
            }`}
          >
            {kpis.itensEmAlerta}
          </p>
          <div
            className={`mb-1.5 ${
              kpis.itensEmAlerta > 0 ? "text-[#ba1a1a]/50" : "text-sage-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
