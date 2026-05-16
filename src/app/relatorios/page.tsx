"use client";

import { useRelatorios } from "@/hooks/useRelatorios";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { KpiCards } from "@/components/features/relatorios/KpiCards";
import { VolumeChart } from "@/components/features/relatorios/VolumeChart";
import { CapacityBars } from "@/components/features/relatorios/CapacityBars";

export default function Relatorios() {
  const { loading, dataInsumos, dataCanteiros, kpis } = useRelatorios();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black font-manrope text-sage-800 tracking-tight mb-2">
          Visão Geral
        </h1>
        <p className="text-sm font-medium text-sage-500">
          Desempenho e saúde do ecossistema botânico em tempo real.
        </p>
      </div>

      <KpiCards kpis={kpis} />
      <VolumeChart data={dataInsumos} />
      <CapacityBars data={dataCanteiros} />
    </div>
  );
}
