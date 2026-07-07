import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  tone?: "green" | "amber" | "red" | "blue" | "neutral";
}

const tones = {
  green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  red: "border-red-400/30 bg-red-400/10 text-red-300",
  blue: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  neutral: "border-white/10 bg-white/5 text-zinc-300"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}
