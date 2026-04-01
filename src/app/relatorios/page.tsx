"use client";

// [AULA DE GRÁFICOS (RECHARTS)]
// O Recharts é uma das bibliotecas gráficas mais famosas e amigáveis para React.
// Importamos as "peças" lego que formam um gráfico: O container responsável por se adaptar a tela (ResponsiveContainer),
// o gráfico de pizza (PieChart), o gráfico de barras (BarChart), o eixo X, Eixo Y, entre outros.
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  
  // Guardamos as fatias da pizza do Estoque aqui: Nome do item e "valor" o quanto tem.
  const [dataInsumos, setDataInsumos] = useState<{name: string, value: number}[]>([]);
  // Guardamos as barras de canteiros aqui: Nome do status e a "quantidade".
  const [dataCanteiros, setDataCanteiros] = useState<{name: string, quantidade: number}[]>([]);

  // Carrega ao abrir a página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // === GRÁFICO 1: PIZZA DO ESTOQUE ===
      const { data: estoque } = await supabase.from('estoque').select('categoria, quantidade');
      if (estoque) {
        // [AULA DE JAVASCRIPT: REDUCE] - O Reduce "amassa" ou "concatena" coisas parecidas.
        // Se temos 3 itens "Semente" com quantidades 10, 5, e 2... ele soma tudo em 17.
        const agrupado = estoque.reduce((acc: Record<string, number>, item) => {
          acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.quantidade);
          return acc;
        }, {});
        
        // Reformatamos matematicamente do formato do Javascript pro formato que o Gráfico Recharts aceita.
        const pieData = Object.keys(agrupado).map(key => ({
          name: key,
          value: agrupado[key]
        }));
        
        // Se caso a lista pieData estiver vazia (> 0), passamos um "dados ficticios em branco"
        setDataInsumos(pieData.length > 0 ? pieData : [{name: 'Sem dados', value: 1}]);
      }

      // === GRÁFICO 2: BARRAS DOS CANTEIROS ===
      const { data: canteiros } = await supabase.from('canteiros').select('status');
      if (canteiros) {
        // Novamente o reduce contando a mesma coisa. Se tem 3 canteiros "Ativo", devolve Ativo = 3.
        const agrupadoCant = canteiros.reduce((acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        const barData = Object.keys(agrupadoCant).map(key => ({
          // Usamos ".replace" porque "Aguardando Colheita" é um texto bem longo, então quebramos para o gráfico não ficar espremido.
          name: key.replace("Aguardando ", "Ag. "), 
          quantidade: agrupadoCant[key]
        }));
        setDataCanteiros(barData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // [AULA DE DESIGN: CORES EXCLUSIVAS]
  // Em vez de usar as cores neon antigas, injetamos a The Botanical Grid na biblioteca gráfica
  const BOTANICAL_COLORS = [
    '#2d5a27', // sage-600
    '#915905', // terra / amarelo
    '#4a6549', // sage-500
    '#c2c9bb', // sage-300
    '#154212', // verde ultra escuro
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">Relatórios Analíticos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICO DE INSUMOS (PIZZA / DONUT) */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(21,66,18,0.03)] flex flex-col">
          <h2 className="text-2xl font-black font-manrope text-sage-700 mb-6 tracking-tight">Volume por Categoria <span className="opacity-50 text-sm">(Estoque)</span></h2>
          
          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataInsumos}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // O InnerRadius transforma a fatia de pizza num "Donut"
                  outerRadius={100}
                  paddingAngle={5} // Espaçamento branco e limpo entre as fatias
                  dataKey="value"
                  stroke="none"
                >
                  {dataInsumos.map((entry, index) => (
                    // Injeta a cor certa da nossa lista baseada na posição (index)
                    <Cell key={`cell-${index}`} fill={BOTANICAL_COLORS[index % BOTANICAL_COLORS.length]} />
                  ))}
                </Pie>
                {/* Modificamos o flutuante que aparece ao colocar o mouse por cima */}
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Volume']}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda Customizada (Trocamos a legenda padrão feia do recharts por essa bonitinha HTML) */}
          <div className="flex justify-center flex-wrap gap-4 text-sm mt-6 pt-6 border-t border-sage-50">
            {dataInsumos.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 font-bold tracking-wider uppercase text-xs">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: BOTANICAL_COLORS[index % BOTANICAL_COLORS.length] }}></span>
                <span className="text-sage-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GRÁFICO DE STATUS CANTEIROS (BARRAS) */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_25px_rgba(21,66,18,0.03)] flex flex-col">
          <h2 className="text-2xl font-black font-manrope text-sage-700 mb-6 tracking-tight">Capacidade Ocupada <span className="opacity-50 text-sm">(Canteiros)</span></h2>
          
          {dataCanteiros.length > 0 ? (
            <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCanteiros} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e9e7" />
                  
                  {/* AxisLine tira a linha contínua do eixo, limpando o design */}
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#4a6549', fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#4a6549', fontWeight: 'bold'}} allowDecimals={false} />
                  
                  <Tooltip 
                    cursor={{fill: '#f2f4f2', radius: 8}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}  
                  />
                  {/* Nossa barra arredondada em cor Sage */}
                  <Bar dataKey="quantidade" fill="#2d5a27" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-sage-400 bg-sage-50/50 rounded-2xl border border-sage-100/50 p-10">
              <span className="font-bold">Sem dados de canteiros.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
