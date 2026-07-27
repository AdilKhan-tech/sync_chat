import { useEffect, useState } from "react";
import { X, Eye, Send, Trash2 } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useStatusStore } from "../../store/useStatusStore";
import StatusViewsModal from "./StatusViewsModal";

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
    deleteStatus,
  } = useStatusStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reply, setReply] = useState("");
  const [openViews, setOpenViews] = useState(false);

  useEffect(() => {
    if (!viewerOpen) return;

    if (selectedStatus && currentUserStatuses.length) {
      const index = currentUserStatuses.findIndex(
        (item) => item.id === selectedStatus.id
      );

      setCurrentIndex(index === -1 ? 0 : index);
    }
  }, [viewerOpen, selectedStatus, currentUserStatuses]);

  const status =
    currentUserStatuses[currentIndex] || selectedStatus;

  const isOwner =
    status &&
    authUser &&
    Number(status.userId) === Number(authUser._id);

  useEffect(() => {
    if (viewerOpen && status && isOwner) {
      getStatusViews(status.id);
    }
  }, [viewerOpen, status?.id, isOwner]);

  if (!viewerOpen || !status) return null;

  const handleReply = async () => {
    if (!reply.trim()) return;

    await replyStatus(status.id, reply);

    setReply("");
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Delete this status?"
    );

    if (!ok) return;

    await deleteStatus(status.id);

    closeViewer();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black z-50">

        {/* Header */}

        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80">

          <div className="flex items-center gap-3">

            <img
              src={status.user?.profilePic || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h2 className="text-white font-semibold">
                {status.user?.fullName}
              </h2>

              <p className="text-xs text-gray-300">
                {new Date(
                  status.createdAt
                ).toLocaleString()}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-red-500"
              >
                <Trash2 size={22} />
              </button>
            )}

            <button
              onClick={closeViewer}
              className="text-white"
            >
              <X size={28} />
            </button>

          </div>

        </div>
        {/* Body */}

        <div className="w-full h-full flex items-center justify-center">

          {status.type === "image" && (
            <img
              src={status.image}
              alt=""
              className="w-full h-full object-contain"
            />
          )}

          {status.type === "video" && (
            <video
              src={status.video}
              autoPlay
              controls
              className="w-full h-full object-contain"
            />
          )}

          {status.type === "text" && (
            <div
              className="w-full h-full flex items-center justify-center p-10 text-center text-3xl font-bold"
              style={{
                backgroundColor: status.backgroundColor,
                color: status.fontColor,
              }}
            >
              {status.text}
            </div>
          )}

        </div>

        {/* Footer */}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">

          {isOwner ? (

            <button
              onClick={() => setOpenViews(true)}
              className="flex items-center gap-2 text-white hover:text-success transition"
            >
              <Eye size={18} />
              <span>{viewers.length} Views</span>
            </button>

          ) : (

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="input input-bordered w-full"
              />

              <button
                onClick={handleReply}
                className="btn btn-success"
              >
                <Send size={18} />
              </button>

            </div>

          )}

        </div>

      </div>

      <StatusViewsModal
        open={openViews}
        onClose={() => setOpenViews(false)}
        viewers={viewers}
      />

    </>
  );
};

export default StatusViewer;
