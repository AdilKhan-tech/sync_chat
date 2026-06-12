import { X } from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";

function ImageLightbox() {
  const { lightboxImage, setLightboxImage } = useSettingsStore();
  if (!lightboxImage) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
      <button type="button" className="absolute top-4 right-4 icon-btn" onClick={() => setLightboxImage(null)}>
        <X className="size-5" />
      </button>
      <img src={lightboxImage} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

export default ImageLightbox;
