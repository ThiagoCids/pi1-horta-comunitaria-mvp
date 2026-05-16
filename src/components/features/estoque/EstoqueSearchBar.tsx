/**
 * ============================================================
 * COMPONENTE: EstoqueSearchBar.tsx (Barra de Busca de Estoque)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um campo de busca que filtra os itens de estoque
 * por nome ou categoria em tempo real (sem consultar o banco).
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página de Estoque passa o estado "busca" e a função "setBusca".
 * Quando o usuário digita, o filtro é aplicado no hook useEstoque.
 * ============================================================
 */

import { Search } from "lucide-react";

type EstoqueSearchBarProps = {
  busca: string;
  setBusca: (v: string) => void;
};

export function EstoqueSearchBar({ busca, setBusca }: EstoqueSearchBarProps) {
  return (
    <div className="relative">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" />
      {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Cada tecla digitada atualiza o estado "busca",
          que automaticamente filtra a lista de itens exibidos na tela */}
      <input
        type="text"
        placeholder="Buscar por nome ou categoria..."
        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-sage-100 rounded-2xl text-sage-700 font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:border-sage-200 transition-all"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
    </div>
  );
}
