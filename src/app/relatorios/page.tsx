"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";
import { Loader2, Sprout, Leaf, PackageSearch, AlertTriangle } from "lucide-react";

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  
  const [dataInsumos, setDataInsumos] = useState<{name: string, value: number, perc: number}[]>([]);
  const [dataCanteiros, setDataCanteiros] = useState<{name: string, quantidade: number, perc: number}[]>([]);

  const [kpis, setKpis] = useState({
    totalCanteiros: 0,
    canteirosAtivos: 0,
    totalItensEstoque: 0,
    itensEmAlerta: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // === DADOS DE ESTOQUE ===
      const { data: estoque } = await supabase.from('estoque').select('*');
      if (estoque) {
        const agrupado = estoque.reduce((acc: Record<string, number>, item) => {
          if (Number(item.quantidade) > 0) {
            acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.quantidade);
          }
          return acc;
        }, {});
        
        const totalEstoqueVol = Object.values(agrupado).reduce((a,b) => a+b, 0);

        const pieData = Object.keys(agrupado).map(key => ({
          name: key,
          value: agrupado[key],
          perc: totalEstoqueVol > 0 ? Math.round((agrupado[key] / totalEstoqueVol) * 100) : 0
        }));
        
        setDataInsumos(pieData);

        const emAlerta = estoque.filter(i => i.quantidade <= i.quantidade_minima).length;
        
        setKpis(prev => ({
          ...prev,
          totalItensEstoque: estoque.length,
          itensEmAlerta: emAlerta
        }));
      }

      // === DADOS DE CANTEIROS ===
      const { data: canteiros } = await supabase.from('canteiros').select('status');
      if (canteiros) {
        const agrupadoCant = canteiros.reduce((acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        const totalCant = canteiros.length;
        const barData = Object.keys(agrupadoCant).map(key => ({
          name: key, 
          quantidade: agrupadoCant[key],
          perc: totalCant > 0 ? Math.round((agrupadoCant[key] / totalCant) * 100) : 0
        })).sort((a, b) => b.quantidade - a.quantidade);

        setDataCanteiros(barData);

        const ativos = canteiros.filter(c => c.status !== 'Vazio').length;
        setKpis(prev => ({
          ...prev,
          totalCanteiros: totalCant,
          canteirosAtivos: ativos
        }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const BOTANICAL_COLORS = [
    '#137333', // Green (Em Desenvolvimento)
    '#0369a1', // Blue (Colhido)
    '#92400e', // Orange (Aguardando Colheita)
    '#8c5a2b', // Brown (Sementeira)
    '#475569', // Slate (Vazio)
  ];

  const getStatusColors = (status: string) => {
    const track = "bg-[#e2e8e0]"; // Fundo neutro para não atrapalhar a visualização
    switch (status) {
      case 'Sementeira': return { fill: 'bg-[#8c5a2b]', track, text: 'text-[#8c5a2b]' }; 
      case 'Em Desenvolvimento': return { fill: 'bg-[#137333]', track, text: 'text-[#137333]' };
      case 'Aguardando Colheita': return { fill: 'bg-[#92400e]', track, text: 'text-[#92400e]' }; 
      case 'Colhido': return { fill: 'bg-[#0369a1]', track, text: 'text-[#0369a1]' };
      case 'Vazio':
      default: return { fill: 'bg-[#475569]', track, text: 'text-[#475569]' };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black font-manrope text-sage-800 tracking-tight mb-2">Visão Geral</h1>
        <p className="text-sm font-medium text-sage-500">Desempenho e saúde do ecossistema botânico em tempo real.</p>
      </div>
      
      {/* 1. SEÇÃO DOS CARTÕES DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
          <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Total de Canteiros</h3>
          <div className="flex items-end gap-2 mt-auto">
            <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">{kpis.totalCanteiros}</p>
            <div className="text-sage-300 mb-1.5"><Sprout className="w-4 h-4"/></div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
          <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Canteiros Ativos</h3>
          <div className="flex items-end gap-2 mt-auto">
            <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">{kpis.canteirosAtivos}</p>
            <div className="text-sage-300 mb-1.5"><Leaf className="w-4 h-4"/></div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px]">
          <h3 className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Itens no Estoque</h3>
          <div className="flex items-end gap-2 mt-auto">
            <p className="text-[2.75rem] font-black font-manrope text-sage-800 leading-none">{kpis.totalItensEstoque}</p>
            <div className="text-sage-300 mb-1.5"><PackageSearch className="w-4 h-4"/></div>
          </div>
        </div>

        <div className={`rounded-[1.5rem] p-6 shadow-[0_2px_15px_rgba(21,66,18,0.03)] flex flex-col justify-between h-[120px] ${kpis.itensEmAlerta > 0 ? 'bg-[#ffdad6]' : 'bg-white'}`}>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest ${kpis.itensEmAlerta > 0 ? 'text-[#ba1a1a]' : 'text-sage-400'}`}>Itens em Alerta</h3>
          <div className="flex items-end gap-2 mt-auto">
            <p className={`text-[2.75rem] font-black font-manrope leading-none ${kpis.itensEmAlerta > 0 ? 'text-[#93000a]' : 'text-sage-800'}`}>
              {kpis.itensEmAlerta}
            </p>
            <div className={`mb-1.5 ${kpis.itensEmAlerta > 0 ? 'text-[#ba1a1a]/50' : 'text-sage-300'}`}>
              <AlertTriangle className="w-4 h-4"/>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO 1: VOLUME POR CATEGORIA (ESTOQUE) */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_2px_15px_rgba(21,66,18,0.03)]">
        <h2 className="text-xl font-bold text-sage-800 mb-2">Volume por Categoria (Estoque)</h2>
        <p className="text-xs text-sage-500 mb-8 max-w-[500px] leading-relaxed">Distribuição volumétrica baseada no inventário atual de sementes, ferramentas e insumos orgânicos.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Legend side */}
          <div className="flex-1 space-y-3 w-full">
            {dataInsumos.length > 0 ? dataInsumos.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: BOTANICAL_COLORS[index % BOTANICAL_COLORS.length] }}></div>
                <div className="text-sm font-medium text-sage-600 flex-1">{entry.name} <span className="text-sage-400">({entry.perc}%)</span></div>
              </div>
            )) : (
              <div className="text-sage-400 text-sm italic">Nenhum item em estoque.</div>
            )}
          </div>
          
          {/* Chart side */}
          <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] flex-shrink-0">
            {dataInsumos.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataInsumos}
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={0}
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={4}
                    >
                      {dataInsumos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BOTANICAL_COLORS[index % BOTANICAL_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[22px] lg:text-2xl font-black text-sage-800">100%</span>
                  <span className="text-[10px] font-bold text-sage-400 tracking-wider">TOTAL</span>
                </div>
              </>
            ) : (
                <div className="w-full h-full rounded-full border-[20px] border-sage-50"></div>
            )}
          </div>
        </div>
      </div>

      {/* GRÁFICO 2: CAPACIDADE OCUPADA (CANTEIROS) */}
      <div className="bg-sage-50/50 rounded-[2rem] p-6 lg:p-8">
        <h2 className="text-xl font-bold text-sage-800 mb-8">Capacidade Ocupada (Canteiros)</h2>
        
        {dataCanteiros.length > 0 ? (
          <div className="space-y-7">
            {dataCanteiros.map((entry) => {
              const { fill, track, text } = getStatusColors(entry.name);
              
              return (
                <div key={entry.name}>
                  <div className="flex justify-between items-end mb-2.5">
                    <span className={`text-xs font-bold uppercase ${text}`}>{entry.name}</span>
                    <span className={`text-[11px] font-bold ${text}`}>{entry.perc}%</span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full ${track} overflow-hidden flex`}>
                    <div 
                      className={`h-full ${fill} rounded-full`} 
                      style={{ width: `${entry.perc}%`, minWidth: entry.perc > 0 ? '4px' : '0' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sage-500 text-sm">
            <Sprout className="w-5 h-5 opacity-50" />
            <span>Nenhum canteiro registrado.</span>
          </div>
        )}
      </div>

    </div>
  );
}
