/**
 * ============================================================
 * ARQUIVO: types/index.ts (Definição de Tipos do Projeto)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Centraliza todos os "tipos" (shapes) de dados que o app utiliza.
 * Um tipo define a FORMA de um objeto — por exemplo, um Canteiro
 * sempre terá id, nome, cultura, status, etc. Isso garante que
 * nunca enviaremos dados errados para o banco de dados ou tela.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Os hooks e componentes importam esses tipos para garantir que
 * o TypeScript valide se estamos usando os dados corretamente.
 * Se um campo for esquecido, o editor mostra um erro ANTES de rodar.
 * ============================================================
 */

// === TIPOS DO MÓDULO "CANTEIROS" ===

// Representa um canteiro completo que vem do banco de dados
export type Canteiro = {
  id: string;                       // Identificador único gerado pelo Supabase
  nome: string;                     // Nome do lote (ex: "Canteiro A")
  cultura: string;                  // O que está plantado (ex: "Alface")
  status: string;                   // Status atual (ex: "Em Desenvolvimento")
  data_plantio: string;             // Data em que foi feito o plantio
  previsao_colheita: string;        // Data prevista para a colheita
  ultima_atividade: string | null;  // Última vez que houve uma atualização
};

// Dados do formulário de criação/edição (sem o id, pois o banco gera automaticamente)
export type CanteiroFormData = {
  nome: string;
  cultura: string;
  status: string;
  data_plantio: string;
  previsao_colheita: string;
};

// === TIPOS DO MÓDULO "ESTOQUE" ===

// Representa um item de estoque completo que vem do banco de dados
export type EstoqueItem = {
  id: string;                         // Identificador único gerado pelo Supabase
  item: string;                       // Nome do item (ex: "Enxada")
  categoria: string;                  // Categoria (ex: "Ferramenta", "Semente")
  quantidade: number;                 // Quantidade atual disponível
  quantidade_minima: number;          // Quantidade mínima antes de gerar alerta
  unidade: string;                    // Unidade de medida (ex: "kg", "un")
  data_atualizacao: string | null;    // Última atualização do registro
};

// Dados do formulário de criação/edição de estoque
export type EstoqueFormData = {
  item: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

// Item em alerta (quando quantidade <= quantidade_minima)
export type EstoqueAlerta = {
  id: string;
  item: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

// === TIPOS DO MÓDULO "DASHBOARD" ===

// Resumo estatístico exibido nos cards da página inicial
export type DashboardSummary = {
  totalCanteiros: number;      // Total de canteiros cadastrados
  ativos: number;              // Canteiros com cultura ativa (não vazio e não colhido)
  emSementeira: number;        // Canteiros na fase de sementeira
  aguardandoColheita: number;  // Canteiros prontos para colher
};

// === TIPOS DO MÓDULO "RELATÓRIOS" ===

// KPIs (Indicadores-chave de Performance) da tela de relatórios
export type RelatorioKpis = {
  totalCanteiros: number;
  canteirosAtivos: number;
  totalItensEstoque: number;
  itensEmAlerta: number;
};

// Dados para o gráfico de pizza (distribuição de insumos por categoria)
export type InsumoData = {
  name: string;   // Nome da categoria (ex: "Semente")
  value: number;  // Quantidade total naquela categoria
  perc: number;   // Percentual do total (ex: 45)
};

// Dados para o gráfico de barras (ocupação dos canteiros por status)
export type CanteiroData = {
  name: string;       // Status (ex: "Em Desenvolvimento")
  quantidade: number; // Quantos canteiros possuem esse status
  perc: number;       // Percentual do total
};
