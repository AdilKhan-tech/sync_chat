import { X, Eye } from "lucide-react";

const StatusViewsModal = ({ open, onClose, viewers }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center">
      <div className="bg-base-100 w-full max-w-md rounded-t-3xl max-h-[70vh] overflow-hidden">

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Eye size={20} />
            <h2 className="font-bold text-lg">
              Viewed by {viewers.length}
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {viewers.length === 0 ? (
            <div className="p-6 text-center opacity-70">
              No one has viewed your status yet.
            </div>
          ) : (
            viewers.map((view) => (
              <div
                key={view.id}
                className="flex items-center gap-3 p-4 border-b hover:bg-base-200"
              >
                <img
                  src={view.viewer?.profilePic || "/avatar.png"}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {view.viewer?.fullName}
                  </h3>

                  <p className="text-sm opacity-60">
                    {new Date(view.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default StatusViewsModal;