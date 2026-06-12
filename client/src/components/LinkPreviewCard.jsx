function LinkPreviewCard({ preview }) {
  if (!preview?.url) return null;
  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noreferrer"
      className="block mt-2 rounded-xl overflow-hidden ring-1 ring-white/[0.08] hover:ring-blue-500/30 transition-all"
    >
      {preview.image && (
        <img src={preview.image} alt="" className="w-full h-28 object-cover" />
      )}
      <div className="p-2.5 theme-surface-subtle">
        <p className="text-xs font-medium theme-text-secondary truncate">{preview.title}</p>
        {preview.description && (
          <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">{preview.description}</p>
        )}
      </div>
    </a>
  );
}

export default LinkPreviewCard;
