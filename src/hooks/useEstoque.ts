import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { EstoqueItem, EstoqueFormData } from "@/types";

const INITIAL_FORM: EstoqueFormData = {
  item: "",
  categoria: "Insumo",
  quantidade: 0,
  quantidade_minima: 0,
  unidade: "kg",
};

export function useEstoque() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<EstoqueFormData>({ ...INITIAL_FORM });

  const fetchEstoque = async () => {
    setLoading(true);
    const { data } = await supabase.from("estoque").select("*").order("item");
    if (data) setEstoque(data);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchEstoque();
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("estoque")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        alert("Erro ao atualizar item: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("estoque").insert([formData]);
      if (error) {
        alert("Erro ao criar item no banco: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    fetchEstoque();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Tem certeza que deseja excluir este item permanentemente?"))
      return;

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

  const openFormNovo = () => {
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    setShowForm(true);
  };

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
