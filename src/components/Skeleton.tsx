export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-0">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between pt-2"><div className="skeleton h-5 w-16" /><div className="skeleton h-4 w-20" /></div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}
