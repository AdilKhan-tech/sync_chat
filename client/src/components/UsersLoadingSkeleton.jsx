function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse p-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-2.5">
          <div className="size-11 rounded-full theme-surface-subtle shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/5 rounded theme-surface-subtle" />
            <div className="h-3 w-3/5 rounded theme-surface-subtle opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;
