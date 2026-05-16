/**
 * ============================================================
 * HOOK: useModalKeyboard.ts (Acessibilidade de Modais)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Hook reutilizável que adiciona duas funcionalidades de UX aos modais:
 *  1. Fecha o modal ao pressionar a tecla Escape
 *  2. Trava o scroll da página enquanto o modal está aberto
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * As páginas de Canteiros e Estoque usam este hook para melhorar
 * a experiência do usuário ao interagir com os formulários modais.
 * É um hook genérico — pode ser usado em qualquer modal do sistema.
 * ============================================================
 */

import { useEffect } from "react";

export function useModalKeyboard(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    // Função que escuta teclas pressionadas pelo usuário
    const handleKeyDown = (e: KeyboardEvent) => {
      // Se o modal está aberto E o usuário pressionou Escape, fecha o modal
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Quando o modal abre: trava o scroll e começa a escutar teclas
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      // Quando o modal fecha: destrava o scroll e para de escutar
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Cleanup: quando o componente é desmontado, garante que o scroll volta ao normal
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
}
