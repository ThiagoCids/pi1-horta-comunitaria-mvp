"use client";

// [AULA DE REACT & NEXT.JS]
// Em React, o estado (useState) guarda as informações dinâmicas da tela.
// O efeito (useEffect) acontece quando a página acaba de carregar, rodando lógicas como "Buscar do Banco".
import { useEffect, useState } from "react";
import { AlertTriangle, Sprout, ShoppingCart, Leaf, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Definimos o "formato" dos avisos de estoque baixo para o TypeScript nos proteger de erros
type EstoqueAlerta = {
  id: string;
  item: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

// Componente principal da página "Início"
export default function Dashboard() {
  // loading: Controla se estamos esperando o banco responder. Começa como 'true'.
  const [loading, setLoading] = useState(true);

  // lowStockItems: Guardará a lista de itens quase acabando.
  const [lowStockItems, setLowStockItems] = useState<EstoqueAlerta[]>([]);

  // summary: Resumo (Contagens de canteiros para mostrar nos blocos/cards)
  const [summary, setSummary] = useState({
    totalCanteiros: 0,
    ativos: 0,
    emSementeira: 0,
    aguardandoColheita: 0,
  });

  // [AULA DE SUPABASE] O useEffect aciona esta rotina logo que você abre a página.
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      // 1. Busca todos do estoque. O `.select('*')` significa "traga todas as colunas".
      const { data: estoque } = await supabase.from('estoque').select('*');
      if (estoque) {
        // Filtro em JavaScript: Pega apenas o que tiver quantidade menor ou igual ao mínimo exigido
        setLowStockItems(estoque.filter(item => item.quantidade <= item.quantidade_minima));
      }

      // 2. Busca apenas o status dos canteiros (não precisamos do nome nem de outras coisas para contar!)
      const { data: canteiros } = await supabase.from('canteiros').select('status');
      if (canteiros) {
        // [AULA DE JAVASCRIPT] `.length` conta o número de resultados.
        setSummary({
          totalCanteiros: canteiros.length,
          ativos: canteiros.filter(c => c.status !== 'Vazio' && c.status !== 'Colhido').length,
          emSementeira: canteiros.filter(c => c.status === 'Sementeira').length,
          aguardandoColheita: canteiros.filter(c => c.status === 'Aguardando Colheita').length,
        });
      }

      // Quando terminar, desligamos o painel de "carregando"
      setLoading(false);
    };

    fetchDashboard();
  }, []); // A lista vazia [] no final garante que rola apenas 1 vez (não fica em looping)

  // Enquanto estiver carregando, mostra apenas um ícone girando no centro.
  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  // [AULA DE UI/UX - THE BOTANICAL GRID]
  // Aqui removemos as bordas antigas (`border border-slate-100`) para usar design de camadas de cor (Tonal Layering).
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex items-center justify-between">
        {/* Usando a font-manrope definida globalmente para o título principal */}
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">Visão Geral</h1>
      </div>

      {/* Alerta de Estoque: Se houverem itens acabando, mostramos essa caixa vermelha translúcida */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#ffdad6]/40 p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-[#ba1a1a]/10">
          <div className="bg-[#ba1a1a]/10 p-2 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-[#ba1a1a]" />
          </div>
          <div>
            <h3 className="text-[#93000a] font-bold text-lg font-manrope tracking-tight">Atenção: Estoque Baixo</h3>
            <ul className="mt-2 text-sm text-[#93000a]/80 space-y-1.5">
              {lowStockItems.map((item) => (
                <li key={item.id} className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                  <span className="font-bold">{item.item}</span>
                  <span className="opacity-75">— temos {item.quantidade}{item.unidade} (Ideal: {item.quantidade_minima}{item.unidade})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 
        GRID: Cria uma "grade" que em PC divide em 4 colunas (grid-cols-4)
        No celular amassa para 1 em cima da outra (grid-cols-1)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrado" value={summary.totalCanteiros} icon={Sprout} />
        <StatCard title="Culturas Ativas" value={summary.ativos} icon={Leaf} />
        <StatCard title="Em Sementeira" value={summary.emSementeira} icon={Sprout} />
        <StatCard title="Prontos para Colher" value={summary.aguardandoColheita} icon={ShoppingCart} highlight />
      </div>

      {/* Card Grande centralizado para Diário/Avisos */}
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(21,66,18,0.03)]">
        <h2 className="text-2xl font-black font-manrope text-sage-700 tracking-tight mb-4">Atividade Recente</h2>
        {summary.totalCanteiros === 0 && lowStockItems.length === 0 ? (
          <div className="bg-sage-50/50 p-6 rounded-xl border border-sage-100/50">
            <p className="text-sage-600 font-medium">✨ Bem-vindo(a) à Horta Comum! Nenhuma atividade registrada no sistema ainda. Adicione canteiros e itens de estoque para dar vida ao painel.</p>
          </div>
        ) : (
          <div className="bg-sage-50/50 p-6 rounded-xl border border-sage-100/50">
            <p className="text-sage-600 font-medium">As últimas interações na sua horta comunitária estão concentradas nas guias de Canteiro e Estoque. Continue o ótimo trabalho mantendo a terra fértil e viva!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponente de Cartão criado especificamente para a Visão Geral
function StatCard({ title, value, icon: Icon, highlight = false }: { title: string, value: number, icon: React.ElementType, highlight?: boolean }) {
  // [AULA DE CSS (TAILWIND)] 
  // Sem bordas (borderless). Sombras ultra brandas. Fundo super claro ou super branco.
  return (
    <div className={`rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${highlight
        ? "bg-sage-700 text-white shadow-[0_15px_40px_rgba(21,66,18,0.2)]"
        : "bg-surface-secondary shadow-[0_4px_25px_rgba(21,66,18,0.03)] bg-white"
      }`}>
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highlight ? "bg-white/10 text-white" : "bg-sage-50 text-sage-600"
          }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className={`text-sm tracking-widest uppercase font-bold mb-1 ${highlight ? "text-white/70" : "text-sage-700/50"
            }`}>{title}</p>
          {/* Display pesada com 'font-manrope' para as contagens ganharem presença brutalista e elegante */}
          <p className={`text-5xl font-black font-manrope tracking-tighter ${highlight ? "text-white" : "text-sage-700"
            }`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
