export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Offline</h1>
        <p className="mt-3 text-sm text-muted-foreground">Du bist gerade offline. Sobald du wieder verbunden bist, kannst du CoSpots normal weiter nutzen.</p>
      </div>
    </main>
  );
}
