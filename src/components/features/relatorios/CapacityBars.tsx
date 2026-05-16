import { Sprout } from "lucide-react";
import type { CanteiroData } from "@/types";

function getStatusColors(status: string) {
  const track = "bg-[#e2e8e0]";
  switch (status) {
    case "Sementeira":
      return { fill: "bg-[#8c5a2b]", track, text: "text-[#8c5a2b]" };
    case "Em Desenvolvimento":
      return { fill: "bg-[#137333]", track, text: "text-[#137333]" };
    case "Aguardando Colheita":
      return { fill: "bg-[#92400e]", track, text: "text-[#92400e]" };
    case "Colhido":
      return { fill: "bg-[#0369a1]", track, text: "text-[#0369a1]" };
    case "Vazio":
    default:
      return { fill: "bg-[#475569]", track, text: "text-[#475569]" };
  }
}

type CapacityBarsProps = {
  data: CanteiroData[];
};

export function CapacityBars({ data }: CapacityBarsProps) {
  return (
    <div className="bg-sage-50/50 rounded-[2rem] p-6 lg:p-8">
      <h2 className="text-xl font-bold text-sage-800 mb-8">
        Capacidade Ocupada (Canteiros)
      </h2>

      {data.length > 0 ? (
        <div className="space-y-7">
          {data.map((entry) => {
            const { fill, track, text } = getStatusColors(entry.name);

            return (
              <div key={entry.name}>
                <div className="flex justify-between items-end mb-2.5">
                  <span className={`text-xs font-bold uppercase ${text}`}>
                    {entry.name}
                  </span>
                  <span className={`text-[11px] font-bold ${text}`}>
                    {entry.perc}%
                  </span>
                </div>
                <div
                  className={`h-2.5 w-full rounded-full ${track} overflow-hidden flex`}
                >
                  <div
                    className={`h-full ${fill} rounded-full`}
                    style={{
                      width: `${entry.perc}%`,
                      minWidth: entry.perc > 0 ? "4px" : "0",
                    }}
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
  );
}
