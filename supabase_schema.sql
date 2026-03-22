-- Supabase DB Schema
-- Tabela de Usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  perfil TEXT NOT NULL CHECK (perfil IN ('admin', 'voluntario', 'membro')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Canteiros
CREATE TABLE canteiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL, -- Ex: Canteiro 1, Canteiro de Ervas
  cultura TEXT NOT NULL, -- Ex: Alface, Cenoura, Manjericão
  status TEXT NOT NULL CHECK (status IN ('Sementeira', 'Em Desenvolvimento', 'Aguardando Colheita', 'Colhido', 'Vazio')),
  data_plantio DATE NOT NULL,
  previsao_colheita DATE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Estoque
CREATE TABLE estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item TEXT NOT NULL, -- Ex: Adubo Orgânico, Semente de Tomate, Regador
  categoria TEXT NOT NULL CHECK (categoria IN ('Insumo', 'Semente', 'Ferramenta', 'Outro')),
  quantidade NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL, -- Ex: kg, g, unidade, litro
  quantidade_minima NUMERIC NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Manutenção
CREATE TABLE manutencao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  canteiro_id UUID REFERENCES canteiros(id) ON DELETE CASCADE,
  acao TEXT NOT NULL, -- Ex: Rega, Adubação, Controle de Pragas, Colheita
  descricao TEXT,
  data_acao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
