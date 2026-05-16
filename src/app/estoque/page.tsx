"use client";

import { Plus, Package } from "lucide-react";
import { useEstoque } from "@/hooks/useEstoque";
import { useModalKeyboard } from "@/hooks/useModalKeyboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { EstoqueCard } from "@/components/features/estoque/EstoqueCard";
import { EstoqueForm } from "@/components/features/estoque/EstoqueForm";
import { EstoqueSearchBar } from "@/components/features/estoque/EstoqueSearchBar";

export default function Estoque() {
  const {
    loading,
    showForm,
    busca,
    setBusca,
    editingId,
    mounted,
    formData,
    setFormData,
    closeForm,
    handleSubmit,
    handleDelete,
    openFormNovo,
    openFormEdit,
    estoqueFiltrado,
  } = useEstoque();

  useModalKeyboard(showForm, closeForm);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Estoque
        </h1>

        <button
          onClick={openFormNovo}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 font-bold tracking-wide w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

      <EstoqueSearchBar busca={busca} setBusca={setBusca} />

      <EstoqueForm
        show={showForm}
        mounted={mounted}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={closeForm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estoqueFiltrado.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Package}
              message="Nada encontrado. Cadastre itens ou mude seus termos de busca."
            />
          </div>
        ) : (
          estoqueFiltrado.map((item) => (
            <EstoqueCard key={item.id} item={item} onEdit={openFormEdit} />
          ))
        )}
      </div>
    </div>
  );
}
