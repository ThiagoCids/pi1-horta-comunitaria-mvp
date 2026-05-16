import type { ElementType } from "react";

type EmptyStateProps = {
  icon: ElementType;
  message: string;
};

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="bg-sage-50/30 border border-sage-100/50 rounded-3xl p-12 text-center">
      <Icon className="w-16 h-16 text-sage-300 mx-auto mb-4" />
      <p className="text-sage-600/70 font-bold">{message}</p>
    </div>
  );
}
