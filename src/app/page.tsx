"use client";

import { Sprout, ShoppingCart, Leaf } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { LowStockAlert } from "@/components/features/dashboard/LowStockAlert";
import { RecentActivity } from "@/components/features/dashboard/RecentActivity";

export default function Dashboard() {
  const { loading, lowStockItems, summary } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black font-manrope text-sage-700 tracking-tight">
          Visão Geral
        </h1>
      </div>

      <LowStockAlert items={lowStockItems} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrado" value={summary.totalCanteiros} icon={Sprout} />
        <StatCard title="Culturas Ativas" value={summary.ativos} icon={Leaf} />
        <StatCard title="Em Sementeira" value={summary.emSementeira} icon={Sprout} />
        <StatCard title="Prontos para Colher" value={summary.aguardandoColheita} icon={ShoppingCart} highlight />
      </div>

      <RecentActivity
        hasCanteiros={summary.totalCanteiros > 0}
        hasLowStock={lowStockItems.length > 0}
      />
    </div>
  );
}
