import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(()=>{
    const handleEscKey = (e) => {
      if(e.key === "Escape"){
        setSelectedUser(null);
      }
    }
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  },[setSelectedUser]);

  return (
    <div className="p-6 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          
          <div className="avatar online">
            <button className="size-14 rounded-full overflow-hidden ring-1 ring-slate-700/40 hover:ring-slate-500/40 transition">
              <img
                src={selectedUser?.profilePic || "/avatar.jpeg"}
                alt={selectedUser?.fullName}
                className="size-full object-cover"
              />
            </button>
          </div>

          <div className="leading-tight">
            <h3 className="text-slate-100 font-medium text-base max-w-[180px] truncate">
              {selectedUser?.fullName}
            </h3>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              Online
            </p>
          </div>
          
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 rounded-md bg-red-600/30 hover:bg-red-600/50 text-red-200 hover:text-red-100 transition-all duration-200"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatHeader;