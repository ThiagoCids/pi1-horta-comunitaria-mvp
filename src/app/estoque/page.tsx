"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Package, Sprout, Wrench, Droplets, Loader2, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type EstoqueItem = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
  data_atualizacao: string | null;
};

const getCategoryIcon = (categoria: string) => {
  switch (categoria.toLowerCase()) {
    case 'semente':
    case 'mudas':
      return <Sprout className="w-8 h-8 text-[#2d5a27]" />;
    case 'ferramenta':
    case 'ferramentas':
      return <Wrench className="w-8 h-8 text-[#4a6549]" />;
    case 'insumo':
    case 'adubo':
      return <Package className="w-8 h-8 text-[#915905]" />;
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
  const [busca, setBusca] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    item: "",
    categoria: "Insumo",
    quantidade: 0,
    quantidade_minima: 0,
    unidade: "kg",
  });

  const fetchEstoque = async () => {
    setLoading(true);
    const { data } = await supabase.from('estoque').select('*').order('item');
    if (data) setEstoque(data);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchEstoque();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };
    if (showForm) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase.from('estoque').update(formData).eq('id', editingId);
      if (error) {
        alert("Erro ao atualizar item: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('estoque').insert([formData]);
      if (error) {
         alert("Erro ao criar item no banco: " + error.message);
         console.error(error);
         return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ item: "", categoria: "Insumo", quantidade: 0, quantidade_minima: 0, unidade: "kg" });
    fetchEstoque();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Tem certeza que deseja excluir este item permanentemente?")) return;
    
    const { error } = await supabase.from('estoque').delete().eq('id', editingId);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    setShowForm(false);
    setEditingId(null);
    fetchEstoque();
  };

  const openFormNovo = () => {
    setEditingId(null);
    setFormData({ item: "", categoria: "Insumo", quantidade: 0, quantidade_minima: 0, unidade: "kg" });
    setShowForm(true);
  };

  const openFormEdit = (item: EstoqueItem) => {
    setEditingId(item.id);
    setFormData({
      item: item.item,
      categoria: item.categoria || "Insumo",
      quantidade: item.quantidade || 0,
      quantidade_minima: item.quantidade_minima || 0,
      unidade: item.unidade || "kg"
    });
    setShowForm(true);
  };

  const estoqueFiltrado = estoque.filter(item => 
    item.item.toLowerCase().includes(busca.toLowerCase()) || 
    item.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">Estoque</h1>
        
        <button
          onClick={openFormNovo}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 font-bold tracking-wide w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

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

      {showForm && mounted && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-estoque-title"
          className="fixed inset-0 bg-sage-700/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        >
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 id="modal-estoque-title" className="text-2xl font-black font-manrope text-sage-700">
                {editingId ? "Editar Item" : "Registrar Item"}
              </h2>
              {editingId && (
                <button type="button" aria-label="Excluir Item" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" title="Excluir Item">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="estoque-nome" className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Nome do Item</label>
                <input
                  id="estoque-nome" type="text" required placeholder="Ex: Enxada rotativa"
                  className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                  value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="estoque-categoria" className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Categoria</label>
                  <select
                    id="estoque-categoria" className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                    value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="Semente">Sementes / Mudas</option>
                    <option value="Insumo">Insumo (Terra, Adubo, etc)</option>
                    <option value="Ferramenta">Ferramenta / Equipamento</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estoque-unidade" className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Unidade</label>
                  <select
                    id="estoque-unidade" className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="estoque-quantidade" className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Quantidade Atual</label>
                  <input
                    id="estoque-quantidade" type="number" required min="0" step="0.1"
                    className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                    value={formData.quantidade} onChange={(e) => setFormData({...formData, quantidade: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label htmlFor="estoque-minima" className="block text-xs font-bold text-[#ba1a1a]/80 mb-2 uppercase tracking-widest">Alerta de Falta (Mínimo)</label>
                  <input
                    id="estoque-minima" type="number" required min="0" step="0.1"
                    className="w-full bg-[#ffdad6]/40 border-2 border-transparent hover:bg-[#ffdad6]/60 text-[#93000a] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffdad6] focus-visible:bg-[#ffdad6]/40 rounded-2xl p-4 transition-all"
                    value={formData.quantidade_minima} onChange={(e) => setFormData({...formData, quantidade_minima: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-white hover:bg-sage-50 text-sage-700 px-4 py-3 rounded-xl transition-all font-bold border border-sage-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200"
                >Cancelar</button>
                <button
                  type="submit"
                  className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
                >{editingId ? "Salvar Alterações" : "Salvar Item"}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estoqueFiltrado.length === 0 ? (
           <div className="col-span-full text-center p-12 bg-sage-50/30 border border-sage-100/50 rounded-3xl">
             <Package className="w-16 h-16 text-sage-300 mx-auto mb-4" />
             <p className="text-sage-600/70 font-bold">Nada encontrado. Cadastre itens ou mude seus termos de busca.</p>
           </div>
        ) : (
          estoqueFiltrado.map((item) => (
            <button 
              key={item.id} 
              type="button"
              onClick={() => openFormEdit(item)}
              className="group bg-white rounded-[2rem] p-6 shadow-[0_4px_25px_rgba(21,66,18,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-sage-50 p-4 rounded-2xl">
                    {getCategoryIcon(item.categoria)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-manrope text-sage-800 tracking-tight leading-tight">{item.item}</h3>
                    <p className="text-sage-400 font-bold uppercase tracking-widest text-[10px] mt-1">{item.categoria}</p>
                  </div>
                </div>
                
                {item.quantidade <= item.quantidade_minima && (
                  <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full animate-pulse border border-[#ffb4ab]">
                    Faltando
                  </span>
                )}
              </div>

              <div className="flex justify-between items-end border-t border-sage-50/50 pt-5 mt-auto">
                <div>
                  <p className="text-[10px] font-bold text-sage-700/60 uppercase tracking-widest mb-1">Volume Disponível</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-4xl font-black font-manrope tracking-tighter ${
                      item.quantidade <= item.quantidade_minima ? "text-[#ba1a1a]" : "text-sage-700"
                    }`}>
                      {item.quantidade}
                    </span>
                    <span className="text-sage-500 font-bold">{item.unidade}</span>
                  </div>
                </div>
              </div>

            </button>
          ))
        )}
      </div>
    </div>
  );
}
