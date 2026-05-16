/**
 * ============================================================
 * PÁGINA: estoque/page.tsx (Gestão de Estoque)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza a tela de gestão de estoque, onde o usuário pode:
 *  - Ver todos os itens cadastrados (sementes, ferramentas, insumos)
 *  - Buscar itens pela barra de pesquisa
 *  - Criar um novo item (botão "Novo Item")
 *  - Editar ou excluir um item (clicando no card)
 *  - Ver alertas visuais quando a quantidade está abaixo do mínimo
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * - Usa o hook useEstoque para toda a lógica de CRUD e filtro
 * - Usa o hook useModalKeyboard para fechar o modal com Escape
 * - Componentes: EstoqueCard, EstoqueForm, EstoqueSearchBar
 * - Esta é a rota "/estoque" do Next.js
 * ============================================================
 */

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
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O hook useEstoque retorna dados, estados e funções CRUD
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
    estoqueFiltrado, // Lista já filtrada pela barra de busca
  } = useEstoque();

  // Ativa o fechamento do modal com tecla Escape
  useModalKeyboard(showForm, closeForm);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho com título e botão de criação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Estoque
        </h1>

        {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Este botão onClick dispara a função que abre o formulário para criar novo item */}
        <button
          onClick={openFormNovo}
          className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-3 rounded-2xl transition-all shadow-sm focus:ring-4 focus:ring-sage-100/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300 font-bold tracking-wide w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

      {/* Barra de busca — filtra os itens pelo nome ou categoria sem consultar o banco novamente */}
      <EstoqueSearchBar busca={busca} setBusca={setBusca} />

      {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Modal do formulário — aparece por cima da página
          Recebe onSubmit (salvar no banco) e onDelete (excluir do banco) como funções */}
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

      {/* Renderiza os cards de estoque ou mensagem de "vazio" */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estoqueFiltrado.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Package}
              message="Nada encontrado. Cadastre itens ou mude seus termos de busca."
            />
          </div>
        ) : (
          // Renderiza cada item do estoque como um card clicável
          estoqueFiltrado.map((item) => (
            <EstoqueCard key={item.id} item={item} onEdit={openFormEdit} />
          ))
        )}
      </div>
    </div>
  );
}
