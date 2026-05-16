import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Canteiro, CanteiroFormData } from "@/types";

const INITIAL_FORM: CanteiroFormData = {
  nome: "",
  cultura: "",
  status: "Vazio",
  data_plantio: new Date().toISOString().split("T")[0],
  previsao_colheita: "",
};

export function useCanteiros() {
  const [canteiros, setCanteiros] = useState<Canteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CanteiroFormData>({ ...INITIAL_FORM });

  const fetchCanteiros = async () => {
    setLoading(true);
    const { data } = await supabase.from("canteiros").select("*").order("nome");
    if (data) setCanteiros(data);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchCanteiros();
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("canteiros")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        alert("Erro ao atualizar canteiro: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("canteiros").insert([formData]);
      if (error) {
        alert("Erro ao criar canteiro no banco: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    fetchCanteiros();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Tem certeza que deseja excluir este canteiro permanentemente?"))
      return;

    const { error } = await supabase
      .from("canteiros")
      .delete()
      .eq("id", editingId);
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
    setFormData({ ...INITIAL_FORM });
    setShowForm(true);
  };

  const openFormEdit = (canteiro: Canteiro) => {
    setEditingId(canteiro.id);
    setFormData({
      nome: canteiro.nome,
      cultura: canteiro.cultura || "",
      status: canteiro.status || "Vazio",
      data_plantio:
        canteiro.data_plantio || new Date().toISOString().split("T")[0],
      previsao_colheita: canteiro.previsao_colheita || "",
    });
    setShowForm(true);
  };

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
