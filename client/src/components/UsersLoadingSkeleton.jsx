function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 animate-pulse"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0" />

          {/* Text Section */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-slate-700 rounded" />
            <div className="h-3 w-1/3 bg-slate-700/70 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;