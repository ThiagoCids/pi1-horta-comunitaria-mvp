# Documentação Oficial: Projeto Horta Comunitária

Este documento compila de forma realista e fidedigna as especificações corretas do código-fonte e do banco de dados adotados na construção do MVP do sistema "Horta Comunitária". Este material foi arquitetado para embasamento técnico na elaboração de Projetos Integradores (TCCs, PIs, etc.).

---

## 1. O Que É o Projeto? (Apresentação)
A **Horta Comunitária** é uma aplicação web de gestão agrícola que visa digitalizar o controle de ambientes de cultivo. Ela elimina a necessidade de anotações em papel que podem ser perdidas, unindo o gerenciamento de plantações e o controle de insumos numa única plataforma centralizada.

A solução oferece uma interface responsiva onde os usuários podem:
- Cadastrar e atualizar o status de **Canteiros** da horta.
- Controlar fluxos de entrada e saída do **Estoque**.
- Promover uma experiência alinhada com as cores e propostas ambientais através de um padrão de design batizado de *"The Botanical Grid"*.

---

## 2. Escolha Tecnológica: As Tecnologias Usadas
A stack selecionada privilegiou um desenvolvimento ágil sem perda de robustez e escalabilidade.

*   **Next.js (App Router) e React:** Como fundação da interface de usuário, adotou-se o framework Next.js. De acordo com a documentação oficial da plataforma, o React permite a componentização (ex: reutilizar o componente `<Layout>` com a mesma barra lateral em todas as subpáginas), enquanto o Next.js gerencia as rotas através da hierarquia das próprias pastas (`/canteiros`, `/estoque`) e gera o HTML limpo, garantindo performance desde o carregamento inicial.
*   **TypeScript:** Substituto ao Javascript puro. Ele exige uma "tipagem estática" para os dados. Ou seja, antes mesmo do código rodar, garantimos que um dado seja salvo corretamente (exemplo: a quantidade do estoque não pode receber uma palavra, apenas números). É primordial para evitar bugs inesperados.
*   **Tailwind CSS:** Framework base para o CSS. Em vez de criar longos arquivos clássicos como `style.css`, aplicou-se estilos no próprio componente do React através de utilitários rápidos (Ex: `className="text-sage-700 bg-white shadow-sm"`). Isso garante uma identidade de marca unificada sem códigos duplicados.
*   **Lucide React:** Uma suíte vetorial em SVG (ícones transparentes) que deixa os painéis da horta intuitivos sem comprometer a memória ou o tempo de carregamento.

---

## 3. Arquitetura de Banco de Dados (Supabase / Postgres)
Descartou-se a criação manual de servidores e máquinas de banco de dados e optou-se pela metodologia de **Backend-as-a-Service (BaaS)** da plataforma **Supabase**. Isso significa que o servidor, as APIs e o log operam de forma isolada do código frontend do projeto.

O banco subjacente é um banco relacional poderoso (**PostgreSQL**). Na concepção exata de nosso código atual e nos nossos tipos Typescripts nativos (disponíveis nos arquivos `canteiros/page.tsx` e `estoque/page.tsx`), a modelagem da nossa realidade trabalha sobre duas entidades centrais:

### 3.1. Tabela `canteiros`
Garante os registros de evolução agrícola e plantações locais:
*   `id` *(string / UUID)*: Chave primária nativa inconfundível.
*   `nome` *(string)*: Identificador social do canteiro.
*   `cultura` *(string)*: Espécie ou cultura plantada.
*   `status` *(string)*: Guarda o cenário em texto como "Plantado", "Vazio", etc.
*   `data_plantio` *(string)*: Data salva em formato ISO que demarca o início.
*   `previsao_colheita` *(string)*: Data referencial de encerramento do cultivo.
*   `ultima_atividade` *(string ou null)*: Opcional de rastreamento das últimas modificações por precaução.

### 3.2. Tabela `estoque`
Comanda o catálogo vivo de insumos agrícolas:
*   `id` *(string / UUID)*: Chave primária.
*   `item` *(string)*: Nome técnico do produto ou ferramenta (Semente, Pá, Regador).
*   `categoria` *(string)*: Define nichos essenciais (Insumo, Semente, Ferramenta) servindo para pintar o layout de acordo.
*   `quantidade` *(number)*: Quantia exata disponível, travada por matemática Typescript.
*   `quantidade_minima` *(number)*: Configuração para geração de gatilhos visuais em cenários de suprimentos escassos.
*   `unidade` *(string)*: Medida quantificadora textual, em litros (L), kilos (kg) ou unidades inteiras.
*   `data_atualizacao` *(string ou null)*: Guarda o momento automático de atualização de item para o gestor.

---

## 4. Inovação: Desenvolvimento Baseado em Inteligência Artificial (Antigravity)
Uma exclusividade essencial para a construção ultrarrápida deste projeto Integrador é a adesão da metodologia de pair-programming e "Agentic AI Coding" usando ferramentas avançadas e especializadas — nesse escopo, o sistema corporativo e experimental do Google DeepMind, batizado de **Antigravity**.

*   **Por que foi usado?** A programação tradicional de arquiteturas de ponta exige extensos ritos de configuração manual. Ao envolver a Inteligência Artificial diretamente atrelada ao terminal (CLI), buscou-se maximizar a produtividade e reverter semanas de trabalhos sintáticos em dias, mantendo nosso foco unicamente em alinhar regras de negócios sustentáveis e não esbarrar em pormenores de linguagem.
*   **Resultados obtidos:** Com o auxílio das ferramentas generativas de programação do Antigravity, o próprio código pôde ser constantemente refatorado e higienizado para manter altos padrões do clean-code, bem como aplicar instantaneamente diretrizes severas de Acessibilidade (WCAG), o que humaniza a ferramenta em prazos viáveis só tornados tangíveis através do uso mais assertivo das IAs aliadas à engenharia de software atual.

---

## 5. Rotas da Aplicação
O sistema atual está segmentado nas rotas:
-   **`/`:** A dashboard principal (índice da aplicação com o compilado).
-   **`/canteiros`**: Layout de visualização mista focada exclusivamente para criar, descartar e monitorar quadros agrícolas (Tabela canteiros acionada por `select`, `insert`, `update` nativas no CRUD).
-   **`/estoque`**: Apresentação tabular com cards modulares focada na aba de produtos com uma barra de busca reativa de digitação em tempo real (estado do próprio componente no React).
-   **`/relatorios`**: Visão tática orientada a gráficos analíticos via Recharts processada à luz dos montantes atuais da base de dados do Supabase.

---

## 6. Bibliografia e Referências Consultadas

1.  **Vercel / React / Next.js:** Documentação oficial sobre Next.js (App Router) e as benesses de tipagem do Typescript atrelado à renderizações front-end:
    - *Referência*: VERCEL. *Next.js Documentation*. Disponível em: https://nextjs.org/docs.
    - *Referência*: META. *React Official Documentation*. Disponível em: https://react.dev/.

2.  **Supabase e Sistemas Relacionais Backend:** Sobre o provimento de bancos de dados modernos PostgreSQL em nuvem:
    - *Referência*: SUPABASE. *Supabase Platform and Postgres Integrations*. Disponível em: https://supabase.com/docs.

3.  **Tailwind CSS:** Justificativas e uso práticos de classes utilitárias baseadas em Mobile First:
    - *Referência*: WATHAN, Adam. *Tailwind CSS Documentation*. Disponível em: https://tailwindcss.com/docs.

4.  **Acessibilidade Web (WAI-ARIA e WCAG):** Fundamentação utilizada em nossos componentes como Focus UI, teclado iterativo e Dialogos ARIA:
    - *Referência*: W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*. Disponível em: https://www.w3.org/TR/WCAG22/.

5.  **Práticas com Agentes de IA/Pair Programming:** Uso e contexto sobre engenharia de software e a adesão de IAs generativas aliadas ao terminal para ganho de velocidade (Google / Antigravity).
    - *(Sua instituição de ensino pode referenciar o laboratório DeepMind / Avanços de Agentes Autônomos em engenharia se aprofundando via fontes sobre Agentic Devops).*
