# 🤖 Documentação de Uso de Inteligência Artificial — Horta Comunitária

## Introdução: IA como Pair Programming Estratégico

Este documento registra, de forma transparente e acadêmica, como a **Inteligência Artificial** foi utilizada como ferramenta de **pair programming estratégico** durante o desenvolvimento do sistema Horta Comunitária.

A IA **não substituiu** o desenvolvedor — ela atuou como um **co-piloto técnico** acelerador. Todas as decisões de negócio, regras de dados e fluxos de usuário foram definidas pela equipe. A IA foi empregada para traduzir essas decisões em código de alta qualidade, aplicar boas práticas automaticamente e reduzir o tempo de implementação de semanas para dias.

As ferramentas utilizadas foram:
- **Google Stitch (MCP)** — Geração e prototipação da interface visual.
- **Google Antigravity (AI Agentic Coding)** — Implementação do backend, CRUD, refatoração e documentação.

---

## Fase 1: Idealização e UI (Stitch MCP)

### Objetivo
Gerar a interface visual responsiva do sistema com um **Design System** coeso antes de conectar qualquer banco de dados.

### O que foi feito
Utilizando o **Stitch MCP** (ferramenta de geração de UI do Google), a equipe definiu em linguagem natural o conceito visual do aplicativo. A IA gerou telas completas com:
- Layout responsivo (Mobile-First) com sidebar para desktop e bottom navigation para mobile.
- Paleta botânica batizada de **"The Botanical Grid"** (tons de sálvia, verde e neutros).
- Tipografia premium com fontes **Manrope** (títulos) e **Inter** (corpo).
- Cards arredondados com sombras suaves e microanimações de hover.
- Dados mockados (fictícios) para validação visual antes da integração com o banco.

### Resultado
A interface foi aprovada pela equipe e serviu como base para a implementação funcional. Nenhum dado real foi utilizado nesta fase — apenas protótipos visuais.

---

## Fase 2: Motor e Banco de Dados (Antigravity)

### Objetivo
Implementar o banco de dados relacional **PostgreSQL** via **Supabase** e criar toda a lógica de CRUD (Create, Read, Update, Delete) nativa.

### O que foi feito
Com o Antigravity rodando no terminal (CLI), a equipe forneceu os requisitos de negócio e a IA implementou:

1. **Modelagem do banco:** Criação das tabelas `canteiros` e `estoque` com tipos corretos, chaves primárias UUID e constraints de integridade.
2. **Cliente Supabase:** Configuração do arquivo `supabase.ts` com variáveis de ambiente seguras.
3. **Operações CRUD completas:**
   - `INSERT` para criação de canteiros e itens de estoque.
   - `SELECT` com ordenação para listagem e busca.
   - `UPDATE` com filtro por ID para edição.
   - `DELETE` com confirmação para exclusão segura.
4. **Filtros e agregações:** Busca em tempo real por nome/categoria no estoque, e cálculo de KPIs para o dashboard.
5. **Acessibilidade (WCAG 2.2):** Modais com `role="dialog"`, `aria-modal="true"`, navegação por teclado (Tab/Escape) e foco visível.

### Resultado
O sistema tornou-se funcional de ponta a ponta: o usuário pode criar, visualizar, editar e excluir registros tanto de canteiros quanto de estoque, com os dados persistidos na nuvem Supabase.

---

## Fase 3: Refatoração Arquitetural e Clean Code

### Objetivo
Reorganizar o código monolítico das páginas em uma **arquitetura profissional** com separação de responsabilidades, eliminação de código morto e padronização de tipos.

### O que foi feito
A equipe forneceu um prompt de refatoração detalhado com regras de ouro ("não quebre o app") e a IA executou:

1. **Extração de Custom Hooks:** A lógica de CRUD e estado foi extraída das páginas para hooks independentes (`useCanteiros`, `useEstoque`, `useDashboard`, `useRelatorios`).
2. **Componentização:** A UI foi separada em componentes reutilizáveis em `/components/ui` (genéricos) e `/components/features` (específicos por módulo).
3. **Centralização de Tipos:** Todos os tipos TypeScript foram consolidados em `/src/types/index.ts`.
4. **Eliminação de Dead Code:** Imports não utilizados, variáveis órfãs e classes CSS redundantes foram removidos.
5. **Documentação Pedagógica:** Comentários didáticos em português foram adicionados em todos os 21 arquivos principais para fins de apresentação acadêmica.

### Resultado
- Páginas reduzidas de ~300 linhas para ~40-80 linhas.
- Build verificado com **0 erros** (Next.js 16.2.1 + Turbopack).
- Código pronto para demonstração em vídeo com comentários `🚨 PONTO DE ATENÇÃO PARA O VÍDEO`.

---

## Exemplos de Prompts Estratégicos Utilizados

### Prompt 1 — Refatoração Arquitetural
```
Aja como um Arquiteto de Software Sênior. Eu tenho um MVP funcional de
um app de Gestão de Hortas feito em Next.js (App Router), Tailwind e Supabase.

Sua tarefa é REFATORAR a estrutura de pastas, a componentização do código
atual e realizar uma LIMPEZA de código (Dead Code Elimination).

⚠️ REGRA DE OURO (NÃO QUEBRE O APP): Nenhuma funcionalidade, fluxo de tela
ou regra de banco de dados deve ser alterada ou perdida.

Diretrizes de Refatoração:
- /src/app: Apenas para as rotas e páginas (page.tsx, layout.tsx).
- /src/components: Separe a UI em subpastas (/ui para genéricos, /features
  para componentes específicos).
- /src/lib: Apenas configurações (supabaseClient.ts).
- /src/hooks: Extraia as chamadas ao Supabase das páginas para Custom Hooks.
```

### Prompt 2 — Documentação Pedagógica para Vídeo
```
Aja como um Professor de Programação. O código do nosso aplicativo está
refatorado e funcionando perfeitamente. O grupo precisará gravar um vídeo
demonstrativo explicando esse código para a banca da universidade.

Sua tarefa é adicionar comentários detalhados, didáticos e em português
nos arquivos principais do projeto, SEM ALTERAR NENHUMA LINHA DE
FUNCIONAMENTO DO CÓDIGO.

Roteiro de comentários:
- No topo de cada arquivo: bloco resumindo "O que faz" e "Como se conecta".
- Na pasta /hooks: Comente as funções CRUD linha a linha.
  Ex: // Aqui chamamos o Supabase para deletar a linha onde o ID é igual
  ao selecionado pelo usuário.
- Na pasta /components e Pages: Comente os blocos-chave de renderização.
  Ex: // Renderiza a lista de canteiros mapeando dados do banco em cards.
- Marque pontos importantes com: 🚨 PONTO DE ATENÇÃO PARA O VÍDEO.
```

### Prompt 3 — Geração de Interface Visual (Stitch)
```
Crie uma interface para um sistema de gestão de hortas comunitárias.
Design System: "The Botanical Grid" — tons de sálvia e verde natural.
Tipografia: Manrope (títulos) e Inter (corpo).
Mobile-First com sidebar no desktop e bottom nav no mobile.
Telas: Dashboard com KPIs, Canteiros com cards, Estoque com busca,
Relatórios com gráficos de pizza e barras horizontais.
```

---

## Considerações Éticas e Acadêmicas

1. **Transparência:** Todo o uso de IA está documentado neste arquivo, com exemplos reais dos prompts utilizados.
2. **Autoria intelectual:** As regras de negócio, requisitos funcionais e decisões de design foram definidas exclusivamente pela equipe. A IA atuou como ferramenta de execução, não de concepção.
3. **Verificação humana:** Todo código gerado pela IA foi revisado, testado e validado pela equipe antes de ser incorporado ao projeto.
4. **Reprodutibilidade:** Os prompts documentados permitem que qualquer pessoa reproduza o processo de desenvolvimento.

---

## Referências

- GOOGLE DEEPMIND. *Antigravity — AI Agentic Coding System*. Ferramenta experimental de engenharia de software assistida por IA.
- GOOGLE. *Stitch MCP — UI Generation Tool*. Ferramenta de prototipação e geração de interfaces via linguagem natural.
- SUPABASE. *Supabase Documentation*. Disponível em: https://supabase.com/docs.
- VERCEL. *Next.js Documentation*. Disponível em: https://nextjs.org/docs.
