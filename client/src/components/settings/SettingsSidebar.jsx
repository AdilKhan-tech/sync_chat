import {
  User,
  Shield,
  Lock,
  MessageCircle,
  Bell,
  Palette,
  CircleHelp,
  LogOut,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function SettingsSidebar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();

  const menus = [
    {
      id: "account",
      title: "Account",
      subtitle: "Profile & Email",
      icon: User,
    },
    {
      id: "privacy",
      title: "Privacy",
      subtitle: "Blocked & Last Seen",
      icon: Shield,
    },
    {
      id: "security",
      title: "Security",
      subtitle: "Password & 2FA",
      icon: Lock,
    },
    {
      id: "chats",
      title: "Chats",
      subtitle: "Wallpaper & Archive",
      icon: MessageCircle,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Sound & Popup",
      icon: Bell,
    },
    {
      id: "appearance",
      title: "Appearance",
      subtitle: "Dark / Light",
      icon: Palette,
    },
    {
      id: "help",
      title: "Help",
      subtitle: "About SyncChat",
      icon: CircleHelp,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#111b21]">

      {/* Header */}

      <div className="p-5 border-b border-zinc-800">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-5"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>

      </div>

      {/* Search */}

      <div className="p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search settings..."
            className="w-full rounded-xl bg-[#202c33] pl-10 pr-4 py-3 outline-none text-white"
          />

        </div>

      </div>

      {/* User */}

      <div className="px-4 mb-4">

        <div className="flex items-center gap-3 rounded-xl bg-[#202c33] p-3">

          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>

            <h2 className="text-white font-semibold">
              {authUser?.fullName}
            </h2>

            <p className="text-zinc-400 text-sm">
              {authUser?.email}
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-3">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`w-full flex items-center gap-4 rounded-xl px-4 py-3 mb-2 transition ${
                activeMenu === menu.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-[#202c33] text-zinc-300"
              }`}
            >
              <Icon size={22} />

              <div className="text-left">

                <h3 className="font-medium">
                  {menu.title}
                </h3>

                <p className="text-xs opacity-70">
                  {menu.subtitle}
                </p>

              </div>

            </button>
          );
        })}

      </div>

      {/* Logout */}

      <div className="p-4 border-t border-zinc-800">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-white"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </div>
  );
}

export default SettingsSidebar;