export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="h-7 w-32 rounded-lg bg-ink/8" />

      {[0, 1, 2].map((i) => (
        <div key={i} className="card mt-6 space-y-3 p-7 first:mt-6">
          <div className="h-4 w-32 rounded bg-ink/8" />
          <div className="h-3 w-full rounded bg-ink/8" />
          <div className="h-3 w-2/3 rounded bg-ink/8" />
        </div>
      ))}
    </div>
  );
}
