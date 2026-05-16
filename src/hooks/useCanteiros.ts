/**
 * ============================================================
 * HOOK: useCanteiros.ts (Lógica e CRUD de Canteiros)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Este é um "Custom Hook" do React que encapsula TODA a lógica
 * de manipulação de canteiros. Ele gerencia:
 *  - Buscar canteiros do banco (READ)
 *  - Criar um novo canteiro (CREATE)
 *  - Editar um canteiro existente (UPDATE)
 *  - Excluir um canteiro (DELETE)
 *  - Controlar estados do formulário (abrir, fechar, limpar)
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * A página /canteiros/page.tsx importa este hook e usa os dados
 * e funções que ele retorna. Isso separa a LÓGICA (este arquivo)
 * do VISUAL (a página), seguindo boas práticas de arquitetura.
 * ============================================================
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Canteiro, CanteiroFormData } from "@/types";

// Estado inicial do formulário — usado ao abrir um formulário "novo" ou ao limpar após salvar
const INITIAL_FORM: CanteiroFormData = {
  nome: "",
  cultura: "",
  status: "Vazio",
  data_plantio: new Date().toISOString().split("T")[0], // Data de hoje no formato YYYY-MM-DD
  previsao_colheita: "",
};

export function useCanteiros() {
  // === ESTADOS DO REACT ===
  // Cada useState cria uma "variável reativa" — quando muda, a tela atualiza automaticamente

  const [canteiros, setCanteiros] = useState<Canteiro[]>([]); // Lista de canteiros vindos do banco
  const [loading, setLoading] = useState(true);               // Indica se estamos carregando dados
  const [showForm, setShowForm] = useState(false);             // Controla se o modal do formulário está aberto
  const [editingId, setEditingId] = useState<string | null>(null); // ID do canteiro sendo editado (null = criando novo)
  const [mounted, setMounted] = useState(false);               // Verifica se o componente já foi montado no DOM
  const [formData, setFormData] = useState<CanteiroFormData>({ ...INITIAL_FORM }); // Dados atuais do formulário

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // READ — Função que busca todos os canteiros do banco de dados
  // ========================================
  const fetchCanteiros = async () => {
    setLoading(true); // Mostra o spinner de carregamento na tela

    // Aqui chamamos o Supabase para LER todos os registros da tabela "canteiros", ordenados por nome
    const { data } = await supabase.from("canteiros").select("*").order("nome");

    // Se o Supabase retornou dados, salvamos no estado do React
    if (data) setCanteiros(data);

    setLoading(false); // Esconde o spinner
  };

  // useEffect roda uma vez quando o componente é carregado pela primeira vez
  useEffect(() => {
    setMounted(true);     // Marca que o componente já está no DOM (necessário para o createPortal do modal)
    fetchCanteiros();     // Carrega os canteiros do banco ao abrir a página
  }, []);

  // Função para fechar o modal do formulário (usada também pelo hook useModalKeyboard)
  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // CREATE + UPDATE — Função que salva um canteiro no banco
  // Se editingId existe, faz UPDATE. Senão, faz INSERT (CREATE).
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário HTML (recarregar a página)

    if (editingId) {
      // === UPDATE: Atualizamos o canteiro existente ===
      // Aqui chamamos o Supabase para ATUALIZAR a linha onde o ID é igual ao canteiro selecionado
      const { error } = await supabase
        .from("canteiros")        // Acessamos a tabela "canteiros"
        .update(formData)          // Enviamos os novos dados do formulário
        .eq("id", editingId);      // Filtramos: só atualiza onde id === editingId

      if (error) {
        alert("Erro ao atualizar canteiro: " + error.message);
        return; // Se deu erro, para aqui e não fecha o modal
      }
    } else {
      // === CREATE: Inserimos um novo canteiro ===
      // Aqui chamamos o Supabase para INSERIR uma nova linha na tabela "canteiros"
      const { error } = await supabase.from("canteiros").insert([formData]);

      if (error) {
        alert("Erro ao criar canteiro no banco: " + error.message);
        return;
      }
    }

    // Após salvar com sucesso, limpamos tudo e recarregamos a lista
    setShowForm(false);                    // Fecha o modal
    setEditingId(null);                    // Limpa o ID de edição
    setFormData({ ...INITIAL_FORM });      // Reseta o formulário
    fetchCanteiros();                      // Recarrega a lista do banco
  };

  // ========================================
  // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO:
  // DELETE — Função que exclui um canteiro permanentemente do banco
  // ========================================
  const handleDelete = async () => {
    if (!editingId) return; // Segurança: não faz nada se não há canteiro selecionado

    // Pede confirmação ao usuário antes de deletar
    if (!confirm("Tem certeza que deseja excluir este canteiro permanentemente?"))
      return;

    // Aqui chamamos o Supabase para DELETAR a linha onde o ID é igual ao selecionado pelo usuário
    const { error } = await supabase
      .from("canteiros")       // Acessamos a tabela "canteiros"
      .delete()                 // Operação de exclusão
      .eq("id", editingId);     // Filtramos: só deleta onde id === editingId

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    // Após excluir, fecha o modal e recarrega a lista
    setShowForm(false);
    setEditingId(null);
    fetchCanteiros();
  };

  // Função para abrir o formulário no modo CRIAÇÃO (sem dados preenchidos)
  const openFormNovo = () => {
    setEditingId(null);                    // Garante que não estamos em modo de edição
    setFormData({ ...INITIAL_FORM });      // Limpa o formulário
    setShowForm(true);                     // Abre o modal
  };

  // Função para abrir o formulário no modo EDIÇÃO (com dados do canteiro selecionado)
  const openFormEdit = (canteiro: Canteiro) => {
    setEditingId(canteiro.id);             // Define qual canteiro estamos editando
    setFormData({                          // Preenche o formulário com os dados atuais
      nome: canteiro.nome,
      cultura: canteiro.cultura || "",
      status: canteiro.status || "Vazio",
      data_plantio:
        canteiro.data_plantio || new Date().toISOString().split("T")[0],
      previsao_colheita: canteiro.previsao_colheita || "",
    });
    setShowForm(true);                     // Abre o modal
  };

  // Retornamos todos os estados e funções para a página usar
  return {
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
  };
}
