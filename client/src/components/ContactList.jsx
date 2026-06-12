import { Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import Avatar from "./Avatar";

function ContactList() {
  const {
    allContacts,
    isContactsLoading,
    setSelectedUser,
    selectedUser,
    isUserOnline,
  } = useChatStore();

  if (isContactsLoading && allContacts.length === 0) return <UsersLoadingSkeleton />;

  if (allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="size-14 rounded-2xl theme-chip flex items-center justify-center mb-4">
          <Users className="size-6 theme-text-faint" />
        </div>
        <p className="text-sm font-medium theme-text-secondary">No contacts yet</p>
        <p className="text-xs theme-text-muted mt-1">Invite others to join SyncChat</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 animate-slide-up">
      {allContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const online = isUserOnline(contact._id);

        return (
          <button
            key={contact._id}
            type="button"
            onClick={() => setSelectedUser(contact)}
            className={`list-item ${isSelected ? "list-item-active" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={contact.profilePic}
                name={contact.fullName}
                size="md"
                online={online}
              />
              <div className="min-w-0 text-left">
                <h4 className="text-sm font-medium theme-text-secondary truncate">
                  {contact.fullName}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {online ? (
                    <span className="text-emerald-400/90">Online</span>
                  ) : (
                    "Offline"
                  )}
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
