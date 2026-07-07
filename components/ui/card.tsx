import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <section className={cn("rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-xl shadow-black/20", className)}>{children}</section>;
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={cn("text-lg font-semibold tracking-tight text-zinc-50", className)}>{children}</h2>;
}
