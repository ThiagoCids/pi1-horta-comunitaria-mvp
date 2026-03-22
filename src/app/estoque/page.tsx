"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, AlertTriangle, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type EstoqueItem = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  quantidade_minima: number;
};

export default function Estoque() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for creating new item
  const [showForm, setShowForm] = useState(false);
  const [novoItem, setNovoItem] = useState({
    item: "", categoria: "Insumo", quantidade: 0, unidade: "kg", quantidade_minima: 1
  });

  const carregarEstoque = async () => {
    const { data, error } = await supabase.from('estoque').select('*').order('item', { ascending: true });
    if (!error && data) {
      setEstoque(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const atualizarQtd = async (id: string, qtdAtual: number, delta: number) => {
    const novaQtd = Math.max(0, qtdAtual + delta);
    
    // Optistic update
    setEstoque(estoque.map(e => e.id === id ? { ...e, quantidade: novaQtd } : e));
    
    // DB update
    await supabase.from('estoque').update({ quantidade: novaQtd }).eq('id', id);
  };

  const criarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoItem.item.trim()) return;
    
    const { error } = await supabase.from('estoque').insert([novoItem]);
    if (!error) {
      setShowForm(false);
      setNovoItem({ item: "", categoria: "Insumo", quantidade: 0, unidade: "kg", quantidade_minima: 1 });
      carregarEstoque();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-sage-700">Controle de Estoque</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto flex justify-center items-center gap-2"
        >
          {showForm ? "✕ Fechar" : "+ Cadastrar Item"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={criarItem} className="bg-sage-100 p-6 rounded-xl border border-sage-200 shadow-inner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end animate-in fade-in slide-in-from-top-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-sage-700">Nome do Item</label>
            <input required type="text" value={novoItem.item} onChange={e => setNovoItem({...novoItem, item: e.target.value})} className="w-full p-2 rounded-lg border-gray-300 focus:ring-sage-500 text-sm" placeholder="Ex: Adubo NPK" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-sage-700">Categoria</label>
            <select value={novoItem.categoria} onChange={e => setNovoItem({...novoItem, categoria: e.target.value})} className="w-full p-2 rounded-lg border-gray-300 bg-white text-sm">
              <option>Insumo</option>
              <option>Semente</option>
              <option>Ferramenta</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-sage-700">Qtd / Un</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={novoItem.quantidade} onChange={e => setNovoItem({...novoItem, quantidade: Number(e.target.value)})} className="w-full p-2 rounded-lg text-sm" />
              <select value={novoItem.unidade} onChange={e => setNovoItem({...novoItem, unidade: e.target.value})} className="w-full max-w-20 p-2 rounded-lg bg-white text-sm">
                <option>kg</option>
                <option>g</option>
                <option>un</option>
                <option>L</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-sage-700 text-white p-2 h-[38px] rounded-lg w-full flex justify-center items-center hover:bg-sage-800">
            <Save className="w-4 h-4" />
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-sage-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : estoque.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-sage-100 text-gray-500">
          <p>Nenhum item cadastrado no estoque ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <ul className="divide-y divide-sage-50">
            {estoque.map((item) => {
              const isLow = item.quantidade <= item.quantidade_minima;
              return (
                <li key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-sage-50/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sage-800 text-lg">{item.item}</h3>
                      {isLow && <span className="bg-alert/10 text-alert-hover text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Baixo
                      </span>}
                    </div>
                    <p className="text-sm text-gray-500">{item.categoria} • Mínimo ideal: {item.quantidade_minima}{item.unidade}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center min-w-16">
                      <span className={`text-2xl font-black ${isLow ? 'text-alert' : 'text-sage-700'}`}>
                        {item.quantidade}
                      </span>
                      <span className="text-xs text-gray-400 font-bold ml-1">{item.unidade}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        onClick={() => atualizarQtd(item.id, item.quantidade, -1)}
                        className="p-3 bg-white rounded-xl text-sage-700 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm border border-sage-100 disabled:opacity-50"
                        disabled={item.quantidade === 0}
                      >
                        <Minus className="w-5 h-5 font-bold" />
                      </button>
                      <button 
                        onClick={() => atualizarQtd(item.id, item.quantidade, 1)}
                        className="p-3 bg-white rounded-xl text-sage-700 hover:bg-sage-100 transition-colors shadow-sm border border-sage-100"
                      >
                        <Plus className="w-5 h-5 font-bold" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
