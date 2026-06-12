import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
    isUserOnline,
  } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (allContacts.length === 0) {
    return (
      <p className="text-center text-slate-500 text-sm py-8">
        No contacts found
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {allContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const online = isUserOnline(contact._id);

        return (
          <button
            key={contact._id}
            type="button"
            onClick={() => setSelectedUser(contact)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
              isSelected
                ? "bg-cyan-500/20 ring-1 ring-cyan-500/30"
                : "hover:bg-slate-700/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={contact.profilePic || "/avatar.jpeg"}
                  alt={contact.fullName}
                  className="size-11 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-slate-800 ${
                    online ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-slate-200 font-medium text-sm truncate">
                  {contact.fullName}
                </h4>
                <p className="text-xs text-slate-500">
                  {online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ContactList;
