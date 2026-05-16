/**
 * ============================================================
 * COMPONENTE UI: EmptyState.tsx (Estado Vazio)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza uma mensagem amigável quando não há dados para exibir.
 * Recebe um ícone e uma mensagem como parâmetros (props).
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Usado em Canteiros e Estoque quando a lista está vazia.
 * ============================================================
 */

import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  message: string;
};

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      {/* Ícone grande centralizado */}
      <Icon className="w-12 h-12 text-sage-200 mx-auto mb-4" />
      {/* Mensagem explicativa */}
      <p className="text-sage-500 font-medium max-w-sm mx-auto">{message}</p>
    </div>
  );
}
