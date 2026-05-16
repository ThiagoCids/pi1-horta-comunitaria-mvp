import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import type { EstoqueFormData } from "@/types";

type EstoqueFormProps = {
  show: boolean;
  mounted: boolean;
  editingId: string | null;
  formData: EstoqueFormData;
  setFormData: (data: EstoqueFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
};

export function EstoqueForm({
  show,
  mounted,
  editingId,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  onClose,
}: EstoqueFormProps) {
  if (!show || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-estoque-title"
      className="fixed inset-0 bg-sage-700/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
    >
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2
            id="modal-estoque-title"
            className="text-2xl font-black font-manrope text-sage-700"
          >
            {editingId ? "Editar Item" : "Registrar Item"}
          </h2>
          {editingId && (
            <button
              type="button"
              aria-label="Excluir Item"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Excluir Item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="estoque-nome"
              className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
            >
              Nome do Item
            </label>
            <input
              id="estoque-nome"
              type="text"
              required
              placeholder="Ex: Enxada rotativa"
              className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="estoque-categoria"
                className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
              >
                Categoria
              </label>
              <select
                id="estoque-categoria"
                className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
              >
                <option value="Semente">Sementes / Mudas</option>
                <option value="Insumo">Insumo (Terra, Adubo, etc)</option>
                <option value="Ferramenta">Ferramenta / Equipamento</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="estoque-unidade"
                className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
              >
                Unidade
              </label>
              <select
                id="estoque-unidade"
                className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                value={formData.unidade}
                onChange={(e) =>
                  setFormData({ ...formData, unidade: e.target.value })
                }
              >
                <option value="un">Unidades (un)</option>
                <option value="kg">Quilos (kg)</option>
                <option value="g">Gramas (g)</option>
                <option value="L">Litros (L)</option>
                <option value="pacotes">Pacotes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="estoque-quantidade"
                className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
              >
                Quantidade Atual
              </label>
              <input
                id="estoque-quantidade"
                type="number"
                required
                min="0"
                step="0.1"
                className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label
                htmlFor="estoque-minima"
                className="block text-xs font-bold text-[#ba1a1a]/80 mb-2 uppercase tracking-widest"
              >
                Alerta de Falta (Mínimo)
              </label>
              <input
                id="estoque-minima"
                type="number"
                required
                min="0"
                step="0.1"
                className="w-full bg-[#ffdad6]/40 border-2 border-transparent hover:bg-[#ffdad6]/60 text-[#93000a] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffdad6] focus-visible:bg-[#ffdad6]/40 rounded-2xl p-4 transition-all"
                value={formData.quantidade_minima}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade_minima: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-sage-50 text-sage-700 px-4 py-3 rounded-xl transition-all font-bold border border-sage-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
            >
              {editingId ? "Salvar Alterações" : "Salvar Item"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
