export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur h-14 shrink-0" />
      <div className="flex-1 flex items-center justify-center min-h-[320px]">
        <p className="text-muted-foreground">Chargement du playground…</p>
      </div>
    </div>
  );
}
