"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Sprout, ShoppingCart, Leaf, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type EstoqueAlerta = {
  id: string;
  item: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<EstoqueAlerta[]>([]);
  const [summary, setSummary] = useState({
    totalCanteiros: 0,
    ativos: 0,
    emSementeira: 0,
    aguardandoColheita: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      
      // Fetch alerts
      const { data: estoque } = await supabase.from('estoque').select('*');
      if (estoque) {
        setLowStockItems(estoque.filter(item => item.quantidade <= item.quantidade_minima));
      }

      // Fetch overview stats
      const { data: canteiros } = await supabase.from('canteiros').select('status');
      if (canteiros) {
        setSummary({
          totalCanteiros: canteiros.length,
          ativos: canteiros.filter(c => c.status !== 'Vazio' && c.status !== 'Colhido').length,
          emSementeira: canteiros.filter(c => c.status === 'Sementeira').length,
          aguardandoColheita: canteiros.filter(c => c.status === 'Aguardando Colheita').length,
        });
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sage-500" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-sage-700">Visão Geral</h1>
      
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-700 font-bold text-lg">Atenção: Estoque Baixo</h3>
            <ul className="mt-2 text-sm text-amber-800 list-disc list-inside space-y-1">
              {lowStockItems.map((item) => (
                <li key={item.id} className="font-medium">
                  {item.item} <span className="text-amber-600/80 font-normal">({item.quantidade}{item.unidade}) - Mínimo ideal: {item.quantidade_minima}{item.unidade}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registrado" value={summary.totalCanteiros} icon={Sprout} />
        <StatCard title="Culturas Ativas" value={summary.ativos} icon={Leaf} />
        <StatCard title="Em Sementeira" value={summary.emSementeira} icon={Sprout} />
        <StatCard title="Prontos para Colher" value={summary.aguardandoColheita} icon={ShoppingCart} color="text-emerald-600" bg="bg-emerald-50" />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Atividade Recente</h2>
        {summary.totalCanteiros === 0 && lowStockItems.length === 0 ? (
          <p className="text-slate-500">Bem-vindo(a)! Nenhuma atividade registrada no sistema ainda. Adicione canteiros e itens de estoque para começar.</p>
        ) : (
          <p className="text-slate-500">O acompanhamento de atividades no momento está sendo feito diretamente nas abas do sistema.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-sage-600", bg = "bg-sage-50" }: { title: string, value: number, icon: React.ElementType, color?: string, bg?: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
