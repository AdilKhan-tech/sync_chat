import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useStatusStore } from "../../store/useStatusStore";

const StatusBar = ({ status }) => {
  const { openViewer, viewStatus, getUserStatuses } = useStatusStore();

  const handleOpen = async () => {
    await viewStatus(status.id);

    await getUserStatuses(status.user.id);

    openViewer(status);
  };

  return (
    <div
      onClick={handleOpen}
      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-base-200 transition-all border-b border-base-300"
    >
      {/* Avatar */}

      <div
        className={`rounded-full p-[3px] ${
          status.isViewed ? "ring-2 ring-gray-400" : "ring-2 ring-green-500"
        }`}
      >
        <img
          src={status.user.profilePic || "/avatar.png"}
          alt={status.user.fullName}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>

      {/* Info */}

      <div className="flex-1">
        <h2 className="font-semibold">{status.user.fullName}</h2>

        <div className="flex items-center gap-2 mt-1 opacity-70 text-sm">
          <Clock size={14} />

          <span>
            {formatDistanceToNow(new Date(status.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Status Type */}

      <div>
        {status.type === "image" && (
          <span className="badge badge-success">Image</span>
        )}

        {status.type === "video" && (
          <span className="badge badge-info">Video</span>
        )}

        {status.type === "text" && (
          <span className="badge badge-warning">Text</span>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
