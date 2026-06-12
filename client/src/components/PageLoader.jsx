function PageLoader() {
  return (
    <div className="app-shell flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 rounded-xl bg-accent flex items-center justify-center">
          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    </div>
  );
}

export default PageLoader;
