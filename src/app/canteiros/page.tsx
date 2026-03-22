"use client";

import { useState, useEffect } from "react";
import { Leaf, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Canteiro = {
  id: string;
  nome: string;
  cultura: string;
  status: string;
  data_plantio: string;
  previsao_colheita: string;
};

const statusColors: Record<string, string> = {
  "Sementeira": "bg-sage-100 text-sage-700",
  "Em Desenvolvimento": "bg-green-100 text-green-700",
  "Aguardando Colheita": "bg-alert/20 text-alert-hover",
  "Colhido": "bg-indigo-100 text-indigo-700",
  "Vazio": "bg-gray-100 text-gray-500"
};

export default function Canteiros() {
  const [canteiros, setCanteiros] = useState<Canteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [novoCanteiro, setNovoCanteiro] = useState({
    nome: "", cultura: "", status: "Sementeira", data_plantio: new Date().toISOString().split('T')[0], previsao_colheita: ""
  });

  const carregarCanteiros = async () => {
    const { data, error } = await supabase.from('canteiros').select('*').order('criado_em', { ascending: false });
    if (!error && data) {
      setCanteiros(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarCanteiros();
  }, []);

  const criarCanteiro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCanteiro.nome || !novoCanteiro.cultura || !novoCanteiro.previsao_colheita) return;
    
    const { error } = await supabase.from('canteiros').insert([novoCanteiro]);
    if (!error) {
      setShowForm(false);
      setNovoCanteiro({ nome: "", cultura: "", status: "Sementeira", data_plantio: new Date().toISOString().split('T')[0], previsao_colheita: "" });
      carregarCanteiros();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-sage-700">Canteiros Ativos</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {showForm ? "✕ Cancelar" : "+ Novo Plantio"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={criarCanteiro} className="bg-white p-6 rounded-xl border border-sage-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold text-sage-700">Nome do Canteiro</label>
            <input required type="text" value={novoCanteiro.nome} onChange={e => setNovoCanteiro({...novoCanteiro, nome: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 text-sm" placeholder="Ex: Canteiro 1" />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-xs font-bold text-sage-700">Cultura</label>
            <input required type="text" value={novoCanteiro.cultura} onChange={e => setNovoCanteiro({...novoCanteiro, cultura: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 text-sm" placeholder="Ex: Alface" />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-xs font-bold text-sage-700">Status</label>
            <select value={novoCanteiro.status} onChange={e => setNovoCanteiro({...novoCanteiro, status: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 bg-white text-sm">
              <option>Sementeira</option>
              <option>Em Desenvolvimento</option>
              <option>Aguardando Colheita</option>
              <option>Colhido</option>
              <option>Vazio</option>
            </select>
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-xs font-bold text-sage-700">Previsão</label>
            <input required type="date" value={novoCanteiro.previsao_colheita} onChange={e => setNovoCanteiro({...novoCanteiro, previsao_colheita: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div className="flex items-end lg:col-span-1">
            <button type="submit" className="bg-sage-700 text-white p-2 h-[38px] rounded-lg w-full flex justify-center items-center hover:bg-sage-800">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sage-500" /></div>
      ) : canteiros.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-sage-100 text-gray-500">
          <p>Nenhum canteiro registrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canteiros.map((canteiro) => {
            // Formatar data simple YYYY-MM-DD para DD/MM/YYYY se aplicável
            const formatData = (d: string) => {
              if(!d) return '';
              const parts = d.split('-');
              if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
              return d;
            };

            return (
              <div key={canteiro.id} className="bg-white rounded-xl p-5 shadow-sm border border-sage-100 flex flex-col justify-between hover:border-sage-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg text-sage-800 break-words">{canteiro.nome}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${statusColors[canteiro.status] || "bg-gray-100"}`}>
                      {canteiro.status}
                    </span>
                  </div>
                  <p className="text-sage-600 flex items-center gap-2 mb-4 font-medium">
                    <Leaf className="w-4 h-4" /> {canteiro.cultura}
                  </p>
                </div>
                
                <div className="text-sm text-gray-500 grid grid-cols-2 gap-2 border-t border-sage-50 pt-3 mt-2">
                  <div>
                    <span className="block text-xs uppercase text-sage-400 font-bold">Plantio</span>
                    <span className="text-gray-700">{formatData(canteiro.data_plantio)}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-sage-400 font-bold">Previsão</span>
                    <span className="text-gray-700">{formatData(canteiro.previsao_colheita)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
