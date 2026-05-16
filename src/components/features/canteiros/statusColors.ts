/**
 * ============================================================
 * UTILITÁRIO: statusColors.ts (Cores e Formatação de Canteiros)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Fornece funções utilitárias compartilhadas entre os componentes
 * de canteiros:
 *  - getStatusColor: retorna classes CSS de cor baseadas no status
 *  - formatDate: converte datas de YYYY-MM-DD para DD/MM/YYYY
 *  - STATUS_OPTIONS: lista fixa de status possíveis
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Usado por CanteiroCard (para a badge), CanteiroForm (para os botões
 * de seleção de status) e CapacityBars (para cores dos gráficos).
 * ============================================================
 */

// Retorna as classes CSS de cor com base no status do canteiro
// isSelected controla se o botão está ativo (no formulário) ou se mostra a cor cheia
export function getStatusColor(status: string, isSelected: boolean = true): string {
  if (!isSelected) {
    // Estilo "não selecionado" — usado nos botões de status do formulário
    return "bg-transparent border-sage-100 text-sage-600 hover:border-sage-300 hover:bg-sage-50";
  }
  // Cada status tem uma cor diferente para facilitar a identificação visual
  switch (status) {
    case "Sementeira":
      return "bg-[#f5e6d3] border-[#e6cda8] text-[#8c5a2b] font-bold";       // Marrom (terra)
    case "Em Desenvolvimento":
      return "bg-[#e6f4ea] border-[#ceead6] text-[#137333] font-bold";        // Verde (crescendo)
    case "Aguardando Colheita":
      return "bg-[#fef3c7] border-[#fde68a] text-[#92400e] font-bold";        // Amarelo (pronto)
    case "Colhido":
      return "bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1] font-bold";        // Azul (finalizado)
    case "Vazio":
    default:
      return "bg-[#f1f5f9] border-[#cbd5e1] text-[#475569] font-bold";        // Cinza (sem uso)
  }
}

// Converte data do formato do banco (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY)
export function formatDate(dateString?: string): string {
  if (!dateString) return "--/--/----";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

// Lista fixa dos status possíveis — usada nos botões do formulário
export const STATUS_OPTIONS = [
  "Vazio",
  "Sementeira",
  "Em Desenvolvimento",
  "Aguardando Colheita",
  "Colhido",
] as const;
