function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-4 mt-auto animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`rounded-2xl px-4 py-3 max-w-[60%] w-full theme-surface-subtle ${
              i % 2 === 0 ? "opacity-80" : "opacity-100"
            }`}
          >
            <div className="h-3 w-4/5 rounded theme-chip mb-2" />
            <div className="h-3 w-2/5 rounded theme-chip opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesLoadingSkeleton;
