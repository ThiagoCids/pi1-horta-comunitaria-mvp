/**
 * ============================================================
 * UTILITÁRIO: categoryIcon.tsx (Ícones por Categoria)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Retorna o ícone visual correto baseado na categoria do item de estoque.
 * Cada categoria tem um ícone diferente para facilitar a identificação visual.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * O componente EstoqueCard importa esta função para exibir o ícone
 * correto ao lado do nome de cada item.
 * ============================================================
 */

import { Sprout, Wrench, Leaf } from "lucide-react";

export function getCategoryIcon(categoria: string) {
  switch (categoria) {
    case "Semente":
      return <Sprout className="w-6 h-6 text-sage-600" />;     // Ícone de broto para sementes
    case "Ferramenta":
      return <Wrench className="w-6 h-6 text-sage-600" />;     // Ícone de ferramenta
    case "Insumo":
    default:
      return <Leaf className="w-6 h-6 text-sage-600" />;       // Ícone de folha para insumos
  }
}
