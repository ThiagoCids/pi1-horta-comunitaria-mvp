import type { ElementType } from "react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ElementType;
  highlight?: boolean;
};

export function StatCard({ title, value, icon: Icon, highlight = false }: StatCardProps) {
  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
        highlight
          ? "bg-sage-700 text-white shadow-[0_15px_40px_rgba(21,66,18,0.2)]"
          : "bg-white shadow-[0_4px_25px_rgba(21,66,18,0.03)]"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            highlight ? "bg-white/10 text-white" : "bg-sage-50 text-sage-600"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p
            className={`text-sm tracking-widest uppercase font-bold mb-1 ${
              highlight ? "text-white/70" : "text-sage-700/50"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-5xl font-black font-manrope tracking-tighter ${
              highlight ? "text-white" : "text-sage-700"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
