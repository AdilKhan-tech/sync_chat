import { useEffect, useState } from "react";
import { X, Eye, Send } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useStatusStore } from "../../store/useStatusStore";

const StatusViewer = () => {
  const { authUser } = useAuthStore();

  const {
    viewerOpen,
    closeViewer,
    currentUserStatuses,
    selectedStatus,
    replyStatus,
    viewers,
    getStatusViews,
  } = useStatusStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!viewerOpen) return;

    if (selectedStatus && currentUserStatuses.length) {
      const index = currentUserStatuses.findIndex(
        (item) => item.id === selectedStatus.id,
      );

      setCurrentIndex(index === -1 ? 0 : index);
    }
  }, [viewerOpen, selectedStatus, currentUserStatuses]);

  const status = currentUserStatuses[currentIndex] || selectedStatus;

  const isOwner =
    status && authUser ? Number(status.userId) === Number(authUser._id) : false;

  // ✅ Hook ab top-level pe hai, koi early return se pehle nahi
  useEffect(() => {
    if (viewerOpen && status && isOwner) {
      getStatusViews(status.id);
    }
  }, [viewerOpen, status?.id, isOwner]);

  if (!viewerOpen) return null;

  if (!status) return null;

  const handleReply = async () => {
    if (!reply.trim()) return;

    await replyStatus(status.id, reply);

    setReply("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-full md:h-[90vh] bg-black">
        {/* Header */}

        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src={status.user?.profilePic || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
              alt=""
            />

            <div>
              <h2 className="text-white font-semibold">
                {status.user?.fullName}
              </h2>

              <p className="text-gray-300 text-xs">
                {new Date(status.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <button onClick={closeViewer} className="text-white">
            <X size={28} />
          </button>
        </div>

        {/* Body */}

        <div className="w-full h-full flex justify-center items-center">
          {status.type === "image" && (
            <img
              src={status.image}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          )}

          {status.type === "video" && (
            <video
              src={status.video}
              controls
              autoPlay
              className="max-h-full max-w-full"
            />
          )}

          {status.type === "text" && (
            <div
              className="w-full h-full flex justify-center items-center text-3xl font-bold p-10 text-center"
              style={{
                background: status.backgroundColor,
                color: status.fontColor,
              }}
            >
              {status.text}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black">
          {isOwner ? (
            <div className="flex items-center gap-2 text-white">
              <Eye size={18} />

              <span>{viewers.length} Views</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Reply..."
                className="input input-bordered w-full"
              />

              <button onClick={handleReply} className="btn btn-success">
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;
