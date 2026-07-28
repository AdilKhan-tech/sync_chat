import { useState } from "react";

import SettingsSidebar from "../components/settings/SettingsSidebar";

import AccountSettings from "../components/settings/AccountSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import ChatSettings from "../components/settings/ChatSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import HelpSettings from "../components/settings/HelpSettings";

function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("account");

  const renderContent = () => {
    switch (activeMenu) {
      case "account":
        return <AccountSettings />;

      case "privacy":
        return <PrivacySettings />;

      case "security":
        return <SecuritySettings />;

      case "chats":
        return <ChatSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "appearance":
        return <AppearanceSettings />;

      case "help":
        return <HelpSettings />;

      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0b1014] text-white overflow-hidden">

      <div className="flex w-full h-full">

        {/* Sidebar */}

        <aside className="w-[340px] h-full border-r border-zinc-800 bg-[#111b21] overflow-y-auto flex-shrink-0">

          <SettingsSidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

        </aside>

        {/* Content */}

        <main className="flex-1 h-full overflow-y-auto bg-[#0b1014]">

          {renderContent()}

        </main>

      </div>

    </div>
  );
}

export default SettingsPage;