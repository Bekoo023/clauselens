export default function ContractDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="h-4 w-24 rounded bg-ink/8" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="h-7 w-56 rounded-lg bg-ink/8" />
          <div className="mt-2 h-3 w-40 rounded bg-ink/8" />
        </div>
        <div className="h-6 w-24 rounded-full bg-ink/8" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-10 w-40 rounded-full bg-ink/8" />
        <div className="h-10 w-40 rounded-full bg-ink/8" />
      </div>

      <div className="card mt-6 flex flex-wrap items-center gap-6 p-7">
        <div className="h-28 w-44 rounded-full bg-ink/8" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-ink/8" />
          <div className="h-3 w-full rounded bg-ink/8" />
          <div className="h-3 w-2/3 rounded bg-ink/8" />
        </div>
      </div>

      <div className="mt-10 h-5 w-48 rounded bg-ink/8" />
      <div className="mt-4 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-28 p-6" />
        ))}
      </div>
    </div>
  );
}
