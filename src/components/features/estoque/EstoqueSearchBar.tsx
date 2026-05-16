import { Search } from "lucide-react";

type EstoqueSearchBarProps = {
  busca: string;
  setBusca: (value: string) => void;
};

export function EstoqueSearchBar({ busca, setBusca }: EstoqueSearchBarProps) {
  return (
    <div className="bg-white rounded-[2rem] p-3 shadow-[0_4px_25px_rgba(21,66,18,0.03)] flex items-center gap-3">
      <div className="bg-sage-50 p-3 rounded-xl text-sage-600">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Buscar por nome ou categoria (Ex: Adubo, Enxada...)"
        className="flex-1 bg-transparent border-0 focus:ring-0 text-sage-700 placeholder-sage-300 font-bold outline-none text-lg"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
    </div>
  );
}
