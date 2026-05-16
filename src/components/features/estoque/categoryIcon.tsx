import { Sprout, Wrench, Package, Droplets } from "lucide-react";

export function getCategoryIcon(categoria: string) {
  switch (categoria.toLowerCase()) {
    case "semente":
    case "mudas":
      return <Sprout className="w-8 h-8 text-[#2d5a27]" />;
    case "ferramenta":
    case "ferramentas":
      return <Wrench className="w-8 h-8 text-[#4a6549]" />;
    case "insumo":
    case "adubo":
      return <Package className="w-8 h-8 text-[#915905]" />;
    case "irrigação":
    case "agua":
      return <Droplets className="w-8 h-8 text-blue-500" />;
    default:
      return <Package className="w-8 h-8 text-slate-400" />;
  }
}
