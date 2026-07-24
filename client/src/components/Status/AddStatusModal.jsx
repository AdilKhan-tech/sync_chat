import { useState } from "react";
import { X, Image, Video, Type } from "lucide-react";
import { useStatusStore } from "../../store/useStatusStore";

const AddStatusModal = ({ open, onClose }) => {
  const { uploadStatus, uploading } = useStatusStore();

  const [type, setType] = useState("image");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#075E54");
  const [fontColor, setFontColor] = useState("#ffffff");

  if (!open) return null;

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = reject;
    });

  const handleFile = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const base64 = await convertToBase64(file);

    setPreview(base64);
  };

  const handleClose = () => {
    setType("image");
    setText("");
    setPreview("");
    setBackgroundColor("#075E54");
    setFontColor("#ffffff");
    onClose();
  };

  const handleSubmit = async () => {
    if (type === "text") {
      await uploadStatus({
        type,
        text,
        backgroundColor,
        fontColor,
      });

      handleClose();
      return;
    }

    if (!preview) return;

    await uploadStatus({
      type,
      image: type === "image" ? preview : null,
      video: type === "video" ? preview : null,
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
      <div
        className="
        bg-base-100
        rounded-xl
        w-[420px]
        max-w-full
        max-h-[90vh]
        overflow-y-auto
        p-5
        "
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Add Status</h2>

          <button onClick={handleClose}>
            <X />
          </button>
        </div>

        {/* Type */}

        <div className="flex gap-3 mb-5">
          <button
            className={`btn ${
              type === "image" ? "btn-success" : "btn-outline"
            }`}
            onClick={() => setType("image")}
          >
            <Image size={18} />
            Image
          </button>

          <button
            className={`btn ${
              type === "video" ? "btn-success" : "btn-outline"
            }`}
            onClick={() => setType("video")}
          >
            <Video size={18} />
            Video
          </button>

          <button
            className={`btn ${type === "text" ? "btn-success" : "btn-outline"}`}
            onClick={() => setType("text")}
          >
            <Type size={18} />
            Text
          </button>
        </div>

        {/* Upload */}

        {type !== "text" ? (
          <>
            <input
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={handleFile}
              className="file-input file-input-bordered w-full"
            />

            {preview && (
              <div className="mt-4">
                {type === "image" ? (
                  <img
                    src={preview}
                    alt=""
                    className="rounded-xl w-full max-h-72 object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="rounded-xl w-full max-h-72"
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <textarea
              className="textarea textarea-bordered w-full h-36"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <div>
                <label className="text-sm">Background</label>

                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm">Font</label>

                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                />
              </div>
            </div>

            <div
              className="mt-5 rounded-xl p-6 text-center text-xl font-bold"
              style={{
                background: backgroundColor,
                color: fontColor,
              }}
            >
              {text || "Preview"}
            </div>
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="btn btn-success w-full mt-6"
        >
          {uploading ? "Uploading..." : "Upload Status"}
        </button>
      </div>
    </div>
  );
};

export default AddStatusModal;
