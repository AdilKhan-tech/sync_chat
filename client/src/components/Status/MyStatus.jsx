import { useState } from "react";
import { Plus, Eye } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useStatusStore } from "../../store/useStatusStore";

import AddStatusModal from "./AddStatusModal";

const MyStatus = () => {
  const { authUser } = useAuthStore();

  const { myStatus, openViewer } = useStatusStore();

  const [open, setOpen] = useState(false);

  const hasStatus = myStatus?.length > 0;

  return (
    <>
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-base-200 transition-all border-b border-base-300">
        <div
          className="flex items-center gap-3"
          onClick={() => {
            if (hasStatus) {
              openViewer(myStatus[0]);
            }
          }}
        >
          <div className="relative">
            <div
              className={`rounded-full p-1 ${
                hasStatus ? "ring-2 ring-success ring-offset-2" : ""
              }`}
            >
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success text-white flex items-center justify-center shadow-lg"
            >
              <Plus size={16} />
            </button>
          </div>

          <div>
            <h2 className="font-semibold text-lg">My Status</h2>

            <p className="text-sm opacity-70">
              {hasStatus ? "Tap to view your status" : "Tap + to add status"}
            </p>
          </div>
        </div>

        {hasStatus && (
          <button
            onClick={() => openViewer(myStatus[0])}
            className="btn btn-circle btn-ghost"
          >
            <Eye size={22} />
          </button>
        )}
      </div>

      <AddStatusModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default MyStatus;
