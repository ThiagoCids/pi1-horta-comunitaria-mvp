/**
 * ============================================================
 * PÁGINA: canteiros/page.tsx (Gestão de Canteiros)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza a tela de gestão de canteiros, onde o usuário pode:
 *  - Ver todos os canteiros cadastrados em formato de cards
 *  - Criar um novo canteiro (botão "Novo Canteiro")
 *  - Editar ou excluir um canteiro (clicando no card)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * - Usa o hook useCanteiros para toda a lógica de CRUD
 * - Usa o hook useModalKeyboard para fechar o modal com Escape
 * - Usa CanteiroCard para exibir cada canteiro
 * - Usa CanteiroForm para o formulário modal de criação/edição
 * - Esta é a rota "/canteiros" do Next.js
 * ============================================================
 */

"use client";

import { Plus, Sprout } from "lucide-react";
import { useCanteiros } from "@/hooks/useCanteiros";
import { useModalKeyboard } from "@/hooks/useModalKeyboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CanteiroCard } from "@/components/features/canteiros/CanteiroCard";
import { CanteiroForm } from "@/components/features/canteiros/CanteiroForm";

export default function Canteiros() {
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O hook useCanteiros retorna TUDO que a página precisa
  // Dados (canteiros, formData), estados (loading, showForm) e funções (handleSubmit, handleDelete)
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

  // Ativa o comportamento de fechar o modal com Escape e travar o scroll
  useModalKeyboard(showForm, closeForm);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho com título e botão de criar */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Canteiros
        </h1>
        {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Este botão onClick dispara a função que abre o formulário de criação */}
        <button
          onClick={openFormNovo}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 font-bold tracking-wide"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Novo Canteiro</span>
        </button>
      </div>

      {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O CanteiroForm é um modal que aparece por cima da página.
          Ele recebe as funções onSubmit (salvar) e onDelete (excluir) como props */}
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

      {/* Renderiza a lista de canteiros ou uma mensagem de "vazio" */}
      {canteiros.length === 0 ? (
        <EmptyState
          icon={Sprout}
          message="Não há canteiros criados no momento. Crie um lote para gerar gráficos!"
        />
      ) : (
        // Renderiza a lista de canteiros mapeando os dados do banco em cards visuais
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
