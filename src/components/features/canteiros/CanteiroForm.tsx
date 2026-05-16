/**
 * ============================================================
 * COMPONENTE: CanteiroForm.tsx (Formulário Modal de Canteiros)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza o formulário modal (popup) para criar ou editar canteiros.
 * Inclui campos para: nome do lote, cultura, datas e status.
 * Usa createPortal para renderizar o modal diretamente no body do HTML,
 * garantindo que fique sempre por cima de todos os outros elementos.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * - Recebe dados e funções via props da página canteiros/page.tsx
 * - As funções onSubmit e onDelete chamam o Supabase (via hook useCanteiros)
 * - O DatePicker é um componente reutilizável de src/components/ui
 * ============================================================
 */

import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import type { CanteiroFormData } from "@/types";
import { getStatusColor, STATUS_OPTIONS } from "./statusColors";

type CanteiroFormProps = {
  show: boolean;
  mounted: boolean;
  editingId: string | null;
  formData: CanteiroFormData;
  setFormData: (data: CanteiroFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
};

export function CanteiroForm({
  show,
  mounted,
  editingId,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  onClose,
}: CanteiroFormProps) {
  // Se o modal não deve ser exibido ou o DOM não está pronto, não renderiza nada
  if (!show || !mounted) return null;

  // createPortal renderiza este elemento diretamente no document.body,
  // fora da árvore normal do React, para garantir que fique por cima de tudo
  return createPortal(
    // Overlay escuro semi-transparente que cobre toda a tela
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-sage-700/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
    >
      {/* Container branco do formulário */}
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho: título dinâmico + botão de excluir (só aparece em modo edição) */}
        <div className="flex justify-between items-center mb-6">
          <h2
            id="modal-title"
            className="text-2xl font-black font-manrope text-sage-700"
          >
            {editingId ? "Editar Canteiro" : "Registrar Canteiro"}
          </h2>
          {editingId && (
            // 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Botão de excluir — chama onDelete que deleta do Supabase
            <button
              type="button"
              aria-label="Excluir Canteiro"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Excluir Canteiro"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: O onSubmit é chamado quando o formulário é enviado.
            Ele decide se faz INSERT (criar) ou UPDATE (editar) no banco de dados. */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Campos de texto: nome do lote e cultura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="canteiro-nome"
                className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
              >
                Identificação do Lote
              </label>
              <input
                id="canteiro-nome"
                type="text"
                required
                placeholder="Ex: Lote A, Ervas"
                className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="canteiro-cultura"
                className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest"
              >
                Cultura Plantada
              </label>
              <input
                id="canteiro-cultura"
                type="text"
                required
                placeholder="Ex: Alface, Manjericão"
                className="w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200 focus-visible:bg-white rounded-2xl p-4 transition-all"
                value={formData.cultura}
                onChange={(e) =>
                  setFormData({ ...formData, cultura: e.target.value })
                }
              />
            </div>
          </div>

          {/* Seletores de data usando o componente DatePicker customizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePicker
              label="Data do Plantio"
              value={formData.data_plantio}
              onChange={(val) =>
                setFormData({ ...formData, data_plantio: val })
              }
            />

            <DatePicker
              label="Previsão Colheita"
              value={formData.previsao_colheita}
              onChange={(val) =>
                setFormData({ ...formData, previsao_colheita: val })
              }
            />
          </div>

          {/* Seletor de status — botões clicáveis com cores dinâmicas */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-sage-700/60 mb-3 uppercase tracking-widest">
              Status Atual do Lote
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`px-5 py-3 text-sm rounded-2xl transition-all border-2
                    ${getStatusColor(s, formData.status === s)}
                    ${
                      formData.status === s
                        ? "shadow-md transform scale-[1.02]"
                        : ""
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Botões de ação: Cancelar e Salvar */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-sage-50 text-sage-700 px-4 py-3 rounded-xl transition-all font-bold border border-sage-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-200"
            >
              Cancelar
            </button>
            {/* 🚨 PONTO DE ATENÇÃO PARA O VÍDEO: Este botão "submit" envia o formulário,
                que chama a função handleSubmit do hook useCanteiros para salvar no banco */}
            <button
              type="submit"
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-300"
            >
              {editingId ? "Salvar Alterações" : "Salvar Canteiro"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
