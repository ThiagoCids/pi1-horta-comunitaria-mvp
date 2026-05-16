// Tipos compartilhados do projeto Horta Comunitária

export type Canteiro = {
  id: string;
  nome: string;
  cultura: string;
  status: string;
  data_plantio: string;
  previsao_colheita: string;
  ultima_atividade: string | null;
};

export type CanteiroFormData = {
  nome: string;
  cultura: string;
  status: string;
  data_plantio: string;
  previsao_colheita: string;
};

export type EstoqueItem = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
  data_atualizacao: string | null;
};

export type EstoqueFormData = {
  item: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

export type EstoqueAlerta = {
  id: string;
  item: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

export type DashboardSummary = {
  totalCanteiros: number;
  ativos: number;
  emSementeira: number;
  aguardandoColheita: number;
};

export type RelatorioKpis = {
  totalCanteiros: number;
  canteirosAtivos: number;
  totalItensEstoque: number;
  itensEmAlerta: number;
};

export type InsumoData = {
  name: string;
  value: number;
  perc: number;
};

export type CanteiroData = {
  name: string;
  quantidade: number;
  perc: number;
};
