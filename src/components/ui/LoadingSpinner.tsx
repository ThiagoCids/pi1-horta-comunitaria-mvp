import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-sage-600 opacity-50" />
    </div>
  );
}
