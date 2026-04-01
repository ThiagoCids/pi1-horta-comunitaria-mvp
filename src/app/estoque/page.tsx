"use client";

// [AULA DE REACT & ARQUITETURA DE DADOS]
// Aqui lidamos com o inventário. Muito importante termos controle do que entra e sai da horta.
import { useState, useEffect } from "react";
// Importamos os ícones do Lucide. Note como selecionamos ícones semânticos (com significado)!
import { Plus, Package, Sprout, Wrench, Droplets, Loader2, Search, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Definindo o que existe de fato numa linha da nossa tabela 'estoque' lá no Supabase
type EstoqueItem = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
  data_atualizacao: string | null;
};

// [AULA DE UX DESIGN]
// No lugar de imagens quebradas ou links difíceis de manter (pois usuários muitas vezes não têm fotos de uma enxada ou adubo),
// Mapeamos a "categoria" escrita no banco de dados para um Ícone vetorizado de altíssima qualidade.
const getCategoryIcon = (categoria: string) => {
  switch (categoria.toLowerCase()) {
    case 'semente':
    case 'mudas':
      return <Sprout className="w-8 h-8 text-[#2d5a27]" />; // Verde folha
    case 'ferramenta':
    case 'ferramentas':
      return <Wrench className="w-8 h-8 text-[#4a6549]" />; // Verde Musgo
    case 'insumo':
    case 'adubo':
      return <Package className="w-8 h-8 text-[#915905]" />; // Marrom terra
    case 'irrigação':
    case 'agua':
      return <Droplets className="w-8 h-8 text-blue-500" />;
    default:
      return <Package className="w-8 h-8 text-slate-400" />;
  }
};

export default function Estoque() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState(""); // Estado simplificado para a barra de pesquisa
  
  // O formData guarda o rascunho de um novo item antes de ser salvo
  const [formData, setFormData] = useState({
    item: "",
    categoria: "Insumo",
    quantidade: 0,
    quantidade_minima: 0,
    unidade: "kg",
  });

  const fetchEstoque = async () => {
    setLoading(true);
    // Trazemos em ordem alfabética do nome do item
    const { data } = await supabase.from('estoque').select('*').order('item');
    if (data) setEstoque(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('estoque').insert([formData]);
    
    if (error) {
       alert("Erro ao salvar no estoque: " + error.message);
       console.error(error);
       return;
    }

    setShowForm(false);
    // Limpar após salvar
    setFormData({ item: "", categoria: "Insumo", quantidade: 0, quantidade_minima: 0, unidade: "kg" });
    fetchEstoque();
  };

  // Botão de deletar rápido e silencioso (apaga e já atualiza a lista)
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      await supabase.from('estoque').delete().eq('id', id);
      fetchEstoque();
    }
  };

  // [AULA DE JAVASCRIPT: FILTER]
  // Aqui pegamos a lista cheia (`estoque`) e deixamos passar apenas os itens cujo nome bate com o texto da barra de busca.
  const estoqueFiltrado = estoque.filter(item => 
    item.item.toLowerCase().includes(busca.toLowerCase()) || 
    item.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">Estoque</h1>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md font-bold tracking-wide w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

      {/* BARRA DE PESQUISA (Glass Panel Search) */}
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

      {/* MODAL / FORMULÁRIO DE ADIÇÃO */}
      {showForm && (
        <div className="fixed inset-0 bg-sage-700/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black font-manrope mb-6 text-sage-700">Entrada de Item</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-sage-700/80 mb-2 uppercase tracking-wider">Nome do Item</label>
                <input
                  type="text" required
                  className="w-full bg-sage-50/50 border-0 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 rounded-xl p-4 outline-none transition-all"
                  value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-sage-700/80 mb-2 uppercase tracking-wider">Categoria</label>
                  <select
                    className="w-full bg-sage-50/50 border-0 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 rounded-xl p-4 outline-none transition-all"
                    value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="Semente">Sementes / Mudas</option>
                    <option value="Insumo">Insumo (Terra, Adubo, etc)</option>
                    <option value="Ferramenta">Ferramenta / Equipamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-sage-700/80 mb-2 uppercase tracking-wider">Unidade</label>
                  <select
                    className="w-full bg-sage-50/50 border-0 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 rounded-xl p-4 outline-none transition-all"
                    value={formData.unidade} onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  >
                    <option value="un">Unidades (un)</option>
                    <option value="kg">Quilos (kg)</option>
                    <option value="g">Gramas (g)</option>
                    <option value="L">Litros (L)</option>
                    <option value="pacotes">Pacotes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-sage-700/80 mb-2 uppercase tracking-wider">Quantidade Atual</label>
                  <input
                    type="number" required min="0" step="0.1"
                    className="w-full bg-sage-50/50 border-0 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 rounded-xl p-4 outline-none transition-all"
                    value={formData.quantidade} onChange={(e) => setFormData({...formData, quantidade: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#ba1a1a]/80 mb-2 uppercase tracking-wider">Alerta de Falta (Mínimo)</label>
                  <input
                    type="number" required min="0" step="0.1"
                    className="w-full bg-[#ffdad6]/40 border-0 text-[#93000a] font-bold focus:ring-4 focus:ring-[#ffdad6] rounded-xl p-4 outline-none transition-all"
                    value={formData.quantidade_minima} onChange={(e) => setFormData({...formData, quantidade_minima: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-white hover:bg-sage-50 text-sage-700 px-4 py-3 rounded-xl font-bold border border-sage-100 transition-all"
                >Cancelar</button>
                <button
                  type="submit"
                  className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-xl font-bold shadow-sm transition-all"
                >Salvar Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRID DO INVENTÁRIO (No Design: Lista ou Grade) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estoqueFiltrado.length === 0 ? (
           <div className="col-span-full text-center p-10 bg-white rounded-3xl border border-sage-100/50 text-sage-500 font-medium">
             Nada encontrado. Cadastre itens ou mude seus termos de busca.
           </div>
        ) : (
          estoqueFiltrado.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(21,66,18,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {/* Ícone Dinâmico semântico */}
                  <div className="bg-sage-50 p-4 rounded-2xl">
                    {getCategoryIcon(item.categoria)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-manrope text-sage-700 tracking-tight">{item.item}</h3>
                    <p className="text-sage-400 font-bold uppercase tracking-wider text-[10px] mt-1">{item.categoria}</p>
                  </div>
                </div>
                
                {/* Lógica condicional (IF): Se tem pouca quantidade, fica com cápsula de destaque vermelha */}
                {item.quantidade <= item.quantidade_minima && (
                  <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] uppercase font-bold px-3 py-1 rounded-full animate-pulse">
                    Faltando
                  </span>
                )}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-sage-400 uppercase tracking-widest mb-1">Volume</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black font-manrope tracking-tighter ${
                      item.quantidade <= item.quantidade_minima ? "text-[#ba1a1a]" : "text-sage-700"
                    }`}>
                      {item.quantidade}
                    </span>
                    <span className="text-sage-500 font-bold">{item.unidade}</span>
                  </div>
                </div>

                {/* Ações (Aparecem só no hover em desktop) */}
                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-sage-50 hover:bg-[#ffdad6] hover:text-[#ba1a1a] text-sage-400 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
