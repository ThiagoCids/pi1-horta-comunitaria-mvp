# 🌱 Horta Comunitária (Projeto Integrador)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Este repositório contém o código-fonte do sistema **Horta Comunitária**. Este projeto consiste em uma aplicação web de gestão agrícola que visa digitalizar o controle de canteiros e ambientes de cultivo. Ela elimina a necessidade de rascunhos em papel combinando a gestão da plantação com um fluxo visual moderno de controle de estoque de insumos.

---

## 🌐 Acesso ao Sistema (Em Produção)
O aplicativo MVP já foi compilado e publicado na nuvem. Você pode testar e utilizar o sistema sem a necessidade de instalar nenhuma linha de código, basta acessar a plataforma via **Vercel**:

🔗 **Acesse ao vivo aqui:** [https://pi1-horta-comunitaria-mvp.vercel.app/](https://pi1-horta-comunitaria-mvp.vercel.app/)

---

## 🎯 Apresentação
O MVP oferece uma interface mobile-first, acessível e responsiva, onde os indivíduos podem:
- Cadastrar e atualizar o status orgânico de **Canteiros** ativos e programar janelas de colheitas através de calendários.
- Monitorar a rotatividade do **Estoque** interno (evitando a escassez de Sementes, Adubos ou Ferramentas de campo).
- Promover uma experiência engajadora alinhada ao design-system *"The Botanical Grid"*.

---

## 💻 Escolha Tecnológica (Stack)
A arquitetura selecionou camadas que garantem estabilidade para escalar a longo prazo baseadas na velocidade do produto local, sendo elas:

*   **Next.js (App Router):** Framework estrutural da interface e gestão do roteamento das páginas. O SSR nativo (renderização server-side) ajuda o sistema a carregar mais rapidamente.
*   **React:** Biblioteca subjacente responsável pelo visual do Next.js, desenhando a interface baseada em "Componentes" independentes (ex: reaproveitar a barra lateral do dashboard).
*   **Vercel:** Plataforma de Cloud Computing (nuvem). Hospeda todo o site gerando integração contínua (CI/CD) gratuitamente, onde a cada alteração aprovada de código ela recompila e sobe um sistema novo no ar.
*   **TypeScript:** Subconjunto do JavaScript encarregado de "travar" e tipar os dados brutos. Se a nossa base exige que "Mínimo de Estoque" seja um número, o Typescript fiscaliza isso no código gerando barreiras antierros cruciais.
*   **Tailwind CSS:** Framework base para o CSS com classes utilitárias que moldam toda a paleta visual botânica do site (tons de verde, sálvia e neutros).  
*   **Lucide React:** Biblioteca oficial de Iconografia baseada no carregamento de ícones transparentes desenhados na hora da renderização (SVG).

---

## 🗄️ Arquitetura de Banco de Dados (Supabase / Postgres)
Adoção oficial de Backend-as-a-Service (BaaS) através da plataforma **Supabase**. O modelo relacional é suportado sob as escotilhas de um forte PostgreSQL. 

Concepção das matrizes centrais da integração local:

### `canteiros`
Garante os registros de evolução agrícola do solo.
*   `id` *(string / UUID)*: Identificador único gerado automaticamente em nossa base.
*   `nome` *(string)*: Identificador social e texto titular do canteiro.
*   `cultura` *(string)*: A espécie ou a cultura que foi depositada no solo (Alface, Cenoura).
*   `status` *(string)*: Guarda os rótulos interativos em String puros ("Plantado", "Vazio").
*   `data_plantio` *(string ISO)*: Marca de plantio oficial.
*   `previsao_colheita` *(string ISO)*: Marca de projeção onde a colheita pode ser colhida.
*   `ultima_atividade` *(string ou null)*: Opcional.

### `estoque`
Comanda exaustivamente o catálogo almoxarifado agrícola.
*   `id` *(string / UUID)*: Chave primária nativa.
*   `item` *(string)*: Nome técnico atrelado a prateleira (Ex: Enxada).
*   `categoria` *(string)*: Define nichos visuais cruciais na interface (Insumo, Ferramenta).
*   `quantidade` *(number)*: Quantia numerável inteira disponível no armazém.
*   `quantidade_minima` *(number)*: Quantia exata calculada para ativar engatilho de "Falta".
*   `unidade` *(string)*: Medida quantificadora textual unitária livre (Kg, cm, L, Un).
*   `data_atualizacao` *(string ou null)*: Timestamp referencial sobre atualização.

---

## 🤖 Engenharia Acelerada por IA (Mecanismo Antigravity)
Uma premissa de alto impacto e inovação tecnológica neste projeto é a inclusão assertiva do desenvolvimento acelerado por Inteligência Artificial — o método *AI-Agentic Pair Programming*. Utilizando extensamente o ecossistema corporativo avançado **Antigravity** do time Google Deepmind rodando embarcado no prompt de comando:

*   **O Impacto da Produtividade:** A IA atuou paralelamente ao engenheiro, não apenas gerando linhas, mas aplicando lógicas arquiteturais. Tarefas metódicas (como criar a conformidade total de todos os pop-ups aos padrões de Acessibilidade da W3C ativados por Teclado e Leitor de Tela) ou recriar reatividades de CSS para celulares que consumiriam dias de laboratório, foram realizadas a 4-mãos em fração da carga horária padrão. Isso re-humanizou o foco do desenvolvedor de apenas um compilador físico para um estrategista das lógicas do agronegócio.

---

## ♿ UX e Acessibilidade Legal (WCAG 2.2)
Adequados todos os escopos das modais, subjanelas e blocos modulares iterativos baseados nos parâmetros fundamentais globais de usabilidade da Web:
- **O Foco Visível para Disfunção Motora e Visual**: O usuário pode iterar sob cada aspecto estrutural navegando no clique do botão `TAB`. O Sistema ressalta as telas com bordas focadas auxiliado de etiquetas invisíveis (`role="dialog"`, `aria-label=""`) que alertam os Leitores Auditivos de Deficientes Visuais, criando acesso de primeira linha em consonância moral inclusiva.

---

## 💻 Para os Desenvolvedores: Como Rodar Localmente

Caso deseje auditar o código em sua máquina e não queira usar a versão Cloud (Vercel) citada acima, siga os passos abaixo:

1. Faça o clone direto de nosso repositório:
```bash
git clone https://github.com/SeuUsuarioOuOrg/horta-comunitaria.git
```
2. Instale as pastas de subdependências com NPM Node:
```bash
npm install
```
3. Rode localmente no seu computador subindo uma porta de servidor React:
```bash
npm run dev
```

> **Atenção Privativa:** O MVP não exibirá Canteiros preenchidos no computador local sem as inserções do URL da Base Relacional privada repousadas nas subchaves digitais da nossa nuvem configurada. 

---
## 📚 Bibliografia Oficial das Tecnologias Aplicadas

1. **Next.js Documentation (Framework Base)**. Diretrizes arquiteturais do App Router, Rendering server-side. Disponível em: https://nextjs.org/docs. 
2. **React Official Documentation (Ecossistema Visual)**. META. Diretrizes de Ciclos de Vida, Componentização e Interfaces de Usuários. Disponível em: https://react.dev/.
3. **Vercel Docs (Deployment Cloud)**. VERCEL. Manual de arquitetura da plataforma de Nuvem, Integrações contínuas e Hospedagem. Disponível em: https://vercel.com/docs.
4. **Supabase Postgres Integrations (Banco de Dados)**. SUPABASE. Documentação focada na plataforma open-source baseada em Postgres que rege os relatórios em nuvem da arquitetura. Disponível em: https://supabase.com/docs.
5. **Tailwind CSS Docs (Estilização Utilitária)**. WATHAN, Adam. Padrão estético desenhando responsividades e paletas. Disponível em: https://tailwindcss.com/docs.
6. **Web Content Accessibility Guidelines (WCAG) 2.2**. CONSÓRCIO W3C. Padrões universais referenciados para garantir a adoção estrita das normas de navegação por foco de teclado e suporte a voz. Disponível em: https://www.w3.org/TR/WCAG22/.
7. **Antigravity AI (Implementação Agente IA - Pair Programming)**. GOOGLE / DEEPMIND. Utilizado extensivamente na metodologia base para maximização da entrega arquitetural, refatoração e auditoria estrutural inteligente. Referências práticas da disciplina de Engenharia de Software Auxiliada.
