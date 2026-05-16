/**
 * ============================================================
 * COMPONENTE UI: LoadingSpinner.tsx (Indicador de Carregamento)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Renderiza um spinner animado centralizado na tela enquanto
 * os dados estão sendo carregados do banco de dados.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Todas as páginas (Dashboard, Canteiros, Estoque, Relatórios)
 * usam este componente durante o carregamento inicial dos dados.
 * ============================================================
 */

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      {/* Spinner circular com animação CSS (animate-spin) */}
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
    </div>
  );
}
