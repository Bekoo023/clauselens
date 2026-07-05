export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-7 w-40 rounded-lg bg-ink/8" />
          <div className="mt-2 h-4 w-56 rounded bg-ink/8" />
        </div>
        <div className="h-10 w-36 rounded-full bg-ink/8" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-3 w-28 rounded bg-ink/8" />
            <div className="mt-2 h-8 w-16 rounded bg-ink/8" />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card h-16 p-5" />
        ))}
      </div>
    </div>
  );
}
