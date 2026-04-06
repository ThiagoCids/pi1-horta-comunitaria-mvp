"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Sprout, Loader2, ArrowRight, Trash2, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DatePicker } from "@/components/ui/DatePicker";

type Canteiro = {
  id: string;
  nome: string;
  cultura: string; 
  status: string;
  data_plantio: string;
  previsao_colheita: string;
  ultima_atividade: string | null;
};

export default function Canteiros() {
  const [canteiros, setCanteiros] = useState<Canteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Voltando para os exatos campos do BANCO DE DADOS (supabase_schema.sql)
  // Sem isso o banco rejeitava silenciosamente nossa inserção!
  const [formData, setFormData] = useState({
    nome: "",
    cultura: "",
    status: "Vazio",
    data_plantio: new Date().toISOString().split('T')[0],
    previsao_colheita: ""
  });

  const fetchCanteiros = async () => {
    setLoading(true);
    const { data } = await supabase.from('canteiros').select('*').order('nome');
    if (data) setCanteiros(data);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchCanteiros();
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inserindo com tratamento de erro no FrontEnd (alert se falhar)
    if (editingId) {
      const { error } = await supabase.from('canteiros').update(formData).eq('id', editingId);
      if (error) {
        alert("Erro ao atualizar canteiro: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('canteiros').insert([formData]);
      if (error) {
         alert("Erro ao criar canteiro no banco: " + error.message);
         console.error(error);
         return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", cultura: "", status: "Vazio", data_plantio: new Date().toISOString().split('T')[0], previsao_colheita: "" });
    fetchCanteiros();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Tem certeza que deseja excluir este canteiro permanentemente?")) return;
    
    const { error } = await supabase.from('canteiros').delete().eq('id', editingId);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    setShowForm(false);
    setEditingId(null);
    fetchCanteiros();
  };

  const openFormNovo = () => {
    setEditingId(null);
    setFormData({ nome: "", cultura: "", status: "Vazio", data_plantio: new Date().toISOString().split('T')[0], previsao_colheita: "" });
    setShowForm(true);
  };

  const openFormEdit = (canteiro: Canteiro) => {
    setEditingId(canteiro.id);
    setFormData({
      nome: canteiro.nome,
      cultura: canteiro.cultura || "",
      status: canteiro.status || "Vazio",
      data_plantio: canteiro.data_plantio || new Date().toISOString().split('T')[0],
      previsao_colheita: canteiro.previsao_colheita || ""
    });
    setShowForm(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--/--/----";
    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) return dateString;
    return `${day}/${month}/${year}`;
  };
  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  const getStatusColor = (status: string, isSelected: boolean = true) => {
    if (!isSelected) {
      return "bg-transparent border-sage-100 text-sage-600 hover:border-sage-300 hover:bg-sage-50";
    }
    switch (status) {
      case 'Sementeira': return 'bg-[#f5e6d3] border-[#e6cda8] text-[#8c5a2b] font-bold'; 
      case 'Em Desenvolvimento': return 'bg-[#e6f4ea] border-[#ceead6] text-[#137333] font-bold';
      case 'Aguardando Colheita': return 'bg-[#fef3c7] border-[#fde68a] text-[#92400e] font-bold'; 
      case 'Colhido': return 'bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1] font-bold';
      case 'Vazio':
      default: return 'bg-[#f1f5f9] border-[#cbd5e1] text-[#475569] font-bold';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">Canteiros</h1>
        <button onClick={openFormNovo} className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 font-bold tracking-wide">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Novo Canteiro</span>
        </button>
      </div>

      {showForm && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-sage-700/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        >
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black font-manrope text-sage-700">
                {editingId ? "Editar Canteiro" : "Registrar Canteiro"}
              </h2>
              {editingId && (
                <button type="button" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all" title="Excluir Canteiro">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Identificação do Lote</label>
                  <input type="text" required placeholder="Ex: Lote A, Ervas" className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 focus:bg-white rounded-2xl p-4 outline-none transition-all" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">Cultura Plantada</label>
                  <input type="text" required placeholder="Ex: Alface, Manjericão" className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus:ring-4 focus:ring-sage-100 focus:bg-white rounded-2xl p-4 outline-none transition-all" value={formData.cultura} onChange={(e) => setFormData({...formData, cultura: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DatePicker 
                  label="Data do Plantio"
                  value={formData.data_plantio}
                  onChange={(val) => setFormData({...formData, data_plantio: val})}
                />

                <DatePicker 
                  label="Previsão Colheita"
                  value={formData.previsao_colheita}
                  onChange={(val) => setFormData({...formData, previsao_colheita: val})}
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-sage-700/60 mb-3 uppercase tracking-widest">Status Atual do Lote</label>
                <div className="flex flex-wrap gap-2">
                  {["Vazio", "Sementeira", "Em Desenvolvimento", "Aguardando Colheita", "Colhido"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, status: s})}
                      className={`px-5 py-3 text-sm rounded-2xl transition-all border-2
                        ${getStatusColor(s, formData.status === s)}
                        ${formData.status === s ? 'shadow-md transform scale-[1.02]' : ''}
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white hover:bg-sage-50 text-sage-700 px-4 py-3 rounded-xl transition-all font-bold border border-sage-100">Cancelar</button>
                <button type="submit" className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-sm">
                  {editingId ? "Salvar Alterações" : "Salvar Canteiro"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {canteiros.length === 0 ? (
        <div className="bg-sage-50/30 border border-sage-100/50 rounded-3xl p-12 text-center">
          <Sprout className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <p className="text-sage-600/70 font-medium font-bold">Não há canteiros criados no momento. Crie um lote para gerar gráficos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canteiros.map((canteiro) => (
            <div 
              key={canteiro.id} 
              onClick={() => openFormEdit(canteiro)}
              className="group bg-white rounded-[2rem] p-6 shadow-[0_4px_25px_rgba(21,66,18,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            >

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

              {/* Informações Visíveis sem precisar clicar */}
              <div className="pt-5 mt-auto border-t border-sage-50/50 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-sage-600/80 font-medium">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-sage-400" />
                    <span>D. Plantio</span>
                  </div>
                  <span className="font-bold text-sage-700">{formatDate(canteiro.data_plantio)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-sage-600/80 font-medium">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-sage-400" />
                    <span>P. Colheita</span>
                  </div>
                  <span className="font-bold text-sage-700">{formatDate(canteiro.previsao_colheita)}</span>
                </div>

                <div className="flex justify-center mt-3 pt-3 border-t border-sage-50/50">
                  <span className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap border ${getStatusColor(canteiro.status, true)}`}>
                    {canteiro.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
