"use client";

import { Plus, Sprout } from "lucide-react";
import { useCanteiros } from "@/hooks/useCanteiros";
import { useModalKeyboard } from "@/hooks/useModalKeyboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CanteiroCard } from "@/components/features/canteiros/CanteiroCard";
import { CanteiroForm } from "@/components/features/canteiros/CanteiroForm";

export default function Canteiros() {
  const {
    canteiros,
    loading,
    showForm,
    editingId,
    mounted,
    formData,
    setFormData,
    closeForm,
    handleSubmit,
    handleDelete,
    openFormNovo,
    openFormEdit,
  } = useCanteiros();

  useModalKeyboard(showForm, closeForm);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Canteiros
        </h1>
        <button
          onClick={openFormNovo}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 font-bold tracking-wide"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Novo Canteiro</span>
        </button>
      </div>

      <CanteiroForm
        show={showForm}
        mounted={mounted}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={closeForm}
      />

      {canteiros.length === 0 ? (
        <EmptyState
          icon={Sprout}
          message="Não há canteiros criados no momento. Crie um lote para gerar gráficos!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canteiros.map((canteiro) => (
            <CanteiroCard
              key={canteiro.id}
              canteiro={canteiro}
              onEdit={openFormEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
