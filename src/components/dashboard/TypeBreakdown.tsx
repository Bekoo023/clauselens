// Horizontal magnitude bars, one hue, directly labeled: no categorical
// palette needed since identity is carried by the text label, not color.
export function TypeBreakdown({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <ul className="space-y-2.5">
      {items.map((i, idx) => (
        <li key={i.label} className="flex items-center gap-3">
          <span title={i.label} className="w-36 shrink-0 truncate text-xs font-medium text-ink-soft">{i.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
            <div
              className="meter-fill-w h-full rounded-full bg-brand/70"
              style={{ width: `${(i.count / max) * 100}%`, transitionDelay: `${idx * 0.05}s` }}
            />
          </div>
          <span className="w-5 shrink-0 text-right text-xs font-semibold">{i.count}</span>
        </li>
      ))}
    </ul>
  );
}
