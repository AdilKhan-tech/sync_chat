const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Avatar({ src, name, size = "md", online, className = "" }) {
  const sizes = {
    xs: "size-7 text-[10px]",
    sm: "size-10 text-xs",
    md: "size-11 text-sm",
    lg: "size-14 text-base",
    xl: "size-16 text-lg",
  };

  const dotSizes = {
    xs: "size-2 border-[1.5px]",
    sm: "size-2.5 border-[1.5px]",
    md: "size-2.5 border-2",
    lg: "size-3 border-2",
    xl: "size-3.5 border-2",
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || "User"}
          className={`${sizes[size]} rounded-full object-cover ring-1 ring-[var(--border)]`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-medium text-white bg-zinc-500 ring-1 ring-[var(--border)]`}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full bg-emerald-500 border-[var(--bg-panel)]`}
        />
      )}
    </div>
  );
}

export default Avatar;
