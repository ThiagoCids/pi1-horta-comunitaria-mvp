/**
 * Utilitários de status e formatação de data para canteiros.
 * Compartilhado entre CanteiroCard, CanteiroForm e Relatórios.
 */

export function getStatusColor(status: string, isSelected: boolean = true): string {
  if (!isSelected) {
    return "bg-transparent border-sage-100 text-sage-600 hover:border-sage-300 hover:bg-sage-50";
  }
  switch (status) {
    case "Sementeira":
      return "bg-[#f5e6d3] border-[#e6cda8] text-[#8c5a2b] font-bold";
    case "Em Desenvolvimento":
      return "bg-[#e6f4ea] border-[#ceead6] text-[#137333] font-bold";
    case "Aguardando Colheita":
      return "bg-[#fef3c7] border-[#fde68a] text-[#92400e] font-bold";
    case "Colhido":
      return "bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1] font-bold";
    case "Vazio":
    default:
      return "bg-[#f1f5f9] border-[#cbd5e1] text-[#475569] font-bold";
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "--/--/----";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

export const STATUS_OPTIONS = [
  "Vazio",
  "Sementeira",
  "Em Desenvolvimento",
  "Aguardando Colheita",
  "Colhido",
] as const;
