export type BarDatum = { label: string; value: number };

export function BarChart({ data, color = '#1f7d8c', height = 140, valueSuffix = '' }: {
  data: BarDatum[];
  color?: string;
  height?: number;
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const h = Math.max((d.value / max) * (height - 28), 2);
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] font-medium text-ink-500">
                {d.value}{valueSuffix}
              </span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{ height: h, backgroundColor: color, opacity: 0.85 }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-ink-400">{d.label}</div>
        ))}
      </div>
    </div>
  );
}
