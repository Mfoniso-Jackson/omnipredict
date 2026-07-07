interface ProbabilityBarProps {
  values: Array<{ label: string; value: number; className: string }>;
}

export function ProbabilityBar({ values }: ProbabilityBarProps) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800" aria-label="Market probability distribution">
      {values.map((item) => (
        <span
          className={`inline-block h-full ${item.className}`}
          key={item.label}
          style={{ width: `${Math.max(2, item.value * 100)}%` }}
          title={`${item.label}: ${Math.round(item.value * 100)}%`}
        />
      ))}
    </div>
  );
}
