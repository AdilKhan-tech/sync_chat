import React from "react";

function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`rounded-2xl px-4 py-3 max-w-xs w-full ${
              i % 2 === 0 ? "bg-cyan-700/30" : "bg-slate-700/30"
            }`}
          >
            {/* text line */}
            <div className="h-3 w-3/4 bg-slate-400/30 rounded mb-2"></div>

            {/* second line */}
            <div className="h-3 w-1/2 bg-slate-400/20 rounded"></div>

            {/* time */}
            <div className="mt-3 h-2 w-16 bg-slate-400/20 rounded"></div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default MessagesLoadingSkeleton;