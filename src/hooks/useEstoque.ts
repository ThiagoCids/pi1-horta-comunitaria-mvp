/**
 * ============================================================
 * HOOK: useEstoque.ts (Lógica e CRUD de Estoque)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Custom Hook que gerencia toda a lógica de manipulação do estoque:
 *  - Buscar itens do estoque (READ)
 *  - Criar um novo item (CREATE)
 *  - Editar um item existente (UPDATE)
 *  - Excluir um item (DELETE)
 *  - Filtrar itens pela barra de busca (lógica local, sem ir ao banco)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página /estoque/page.tsx importa este hook e consome os dados
 * e funções retornados. A estrutura é idêntica ao useCanteiros,
 * mas opera na tabela "estoque" do Supabase.
 * ============================================================
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { EstoqueItem, EstoqueFormData } from "@/types";

// Estado inicial do formulário de estoque
const INITIAL_FORM: EstoqueFormData = {
  item: "",
  categoria: "Insumo",
  quantidade: 0,
  quantidade_minima: 0,
  unidade: "kg",
};

export function useEstoque() {
  // === ESTADOS DO REACT ===
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);   // Lista de itens vindos do banco
  const [loading, setLoading] = useState(true);                 // Indica carregamento
  const [showForm, setShowForm] = useState(false);              // Controla o modal do formulário
  const [busca, setBusca] = useState("");                       // Texto digitado na barra de busca
  const [editingId, setEditingId] = useState<string | null>(null); // ID do item sendo editado
  const [mounted, setMounted] = useState(false);                // Se o componente está montado no DOM
  const [formData, setFormData] = useState<EstoqueFormData>({ ...INITIAL_FORM });

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // READ — Busca todos os itens de estoque do banco de dados
  // ========================================
  const fetchEstoque = async () => {
    setLoading(true);

    // Chamamos o Supabase para LER todos os registros da tabela "estoque", ordenados pelo nome do item
    const { data } = await supabase.from("estoque").select("*").order("item");

    if (data) setEstoque(data);
    setLoading(false);
  };

  // Carrega os dados do banco quando o componente é montado pela primeira vez
  useEffect(() => {
    setMounted(true);
    fetchEstoque();
  }, []);

  // Fecha o modal do formulário
  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // CREATE + UPDATE — Salva (cria ou atualiza) um item no banco
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o reload da página

    if (editingId) {
      // === UPDATE: Atualiza o item existente no banco ===
      // Chamamos o Supabase para ATUALIZAR a linha onde o ID é igual ao item selecionado
      const { error } = await supabase
        .from("estoque")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        alert("Erro ao atualizar item: " + error.message);
        return;
      }
    } else {
      // === CREATE: Insere um novo item no banco ===
      // Chamamos o Supabase para INSERIR uma nova linha na tabela "estoque"
      const { error } = await supabase.from("estoque").insert([formData]);
      if (error) {
        alert("Erro ao criar item no banco: " + error.message);
        return;
      }
    }

    // Limpa tudo e recarrega a lista após salvar
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    fetchEstoque();
  };

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // DELETE — Exclui um item permanentemente do banco de dados
  // ========================================
  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Tem certeza que deseja excluir este item permanentemente?"))
      return;

    // Chamamos o Supabase para DELETAR a linha onde o ID é igual ao selecionado pelo usuário
    const { error } = await supabase
      .from("estoque")
      .delete()
      .eq("id", editingId);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    setShowForm(false);
    setEditingId(null);
    fetchEstoque();
  };

  // Abre o formulário no modo CRIAÇÃO (limpo)
  const openFormNovo = () => {
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    setShowForm(true);
  };

  // Abre o formulário no modo EDIÇÃO (preenchido com os dados do item selecionado)
  const openFormEdit = (item: EstoqueItem) => {
    setEditingId(item.id);
    setFormData({
      item: item.item,
      categoria: item.categoria || "Insumo",
      quantidade: item.quantidade || 0,
      quantidade_minima: item.quantidade_minima || 0,
      unidade: item.unidade || "kg",
    });
    setShowForm(true);
  };

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // FILTRO LOCAL — Filtra a lista de estoque com base no texto da barra de busca
  // Esse filtro acontece NO FRONT-END (sem nova consulta ao banco)
  // ========================================
  const estoqueFiltrado = estoque.filter(
    (item) =>
      item.item.toLowerCase().includes(busca.toLowerCase()) ||
      item.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return {
    estoque,
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
  };
}
