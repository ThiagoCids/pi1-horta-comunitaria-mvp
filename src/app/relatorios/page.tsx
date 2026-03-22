"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [dataInsumos, setDataInsumos] = useState<{name: string, value: number}[]>([]);
  const [dataCanteiros, setDataCanteiros] = useState<{name: string, quantidade: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Estoque to group by Category
      const { data: estoque } = await supabase.from('estoque').select('categoria, quantidade');
      if (estoque) {
        const agrupado = estoque.reduce((acc: Record<string, number>, item) => {
          acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.quantidade);
          return acc;
        }, {});
        const pieData = Object.keys(agrupado).map(key => ({
          name: key,
          value: agrupado[key]
        }));
        // If empty, put a placeholder so chart renders
        setDataInsumos(pieData.length > 0 ? pieData : [{name: 'Sem dados', value: 1}]);
      }

      // Fetch Canteiros to group by Status
      const { data: canteiros } = await supabase.from('canteiros').select('status');
      if (canteiros) {
        const agrupadoCant = canteiros.reduce((acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        const barData = Object.keys(agrupadoCant).map(key => ({
          name: key.replace("Aguardando ", "Ag. "), // abbreviate for better UI
          quantidade: agrupadoCant[key]
        }));
        setDataCanteiros(barData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Using the distinctive colors we added to globals.css
  const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#3b82f6'];

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sage-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-sage-700">Relatórios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Insumos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100 flex flex-col">
          <h2 className="text-lg font-bold text-sage-700 mb-4">Itens em Estoque (por Categoria)</h2>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataInsumos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataInsumos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} itens`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-4 text-sm mt-4">
            {dataInsumos.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1 font-medium">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Status Canteiros */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100 flex flex-col">
          <h2 className="text-lg font-bold text-sage-700 mb-4">Volume de Canteiros (por Status)</h2>
          {dataCanteiros.length > 0 ? (
            <div className="h-64 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCanteiros} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="quantidade" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400">Sem dados de canteiros.</div>
          )}
        </div>
      </div>
    </div>
  );
}
