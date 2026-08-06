export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-3 w-24 rounded shimmer" />
          <div className="mt-2 h-7 w-40 rounded-lg shimmer" />
        </div>
        <div className="h-10 w-36 rounded-full shimmer" />
      </div>

      <div className="card mt-5 h-16 animate-pulse p-5" />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-9 w-9 rounded-xl shimmer" />
            <div className="mt-3 h-8 w-16 rounded shimmer" />
          </div>
        ))}
      </div>

      <div className="card mt-4 h-40 animate-pulse p-5" />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card h-32 animate-pulse p-5" />
        <div className="card h-32 animate-pulse p-5" />
      </div>

      <div className="mt-8 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card h-16 animate-pulse p-5" />
        ))}
      </div>
    </div>
  );
}
