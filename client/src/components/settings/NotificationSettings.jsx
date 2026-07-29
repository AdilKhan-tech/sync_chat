import { useState } from "react";
import {
  Bell,
  Volume2,
  Smartphone,
  MessageCircle,
  Phone,
} from "lucide-react";

function NotificationSettings() {
  const [messageNotification, setMessageNotification] = useState(true);
  const [callNotification, setCallNotification] = useState(true);
  const [desktopNotification, setDesktopNotification] = useState(true);
  const [sound, setSound] = useState(true);
  const [preview, setPreview] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b141a] text-white">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-2">
          Notifications
        </h1>

        <p className="text-zinc-400 mb-8">
          Control how SyncChat notifies you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Message Notification */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <MessageCircle className="text-green-500" />

              <div>

                <h2 className="font-semibold">
                  Message Notifications
                </h2>

                <p className="text-zinc-400 text-sm">
                  Receive notifications for new messages.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={messageNotification}
              onChange={() =>
                setMessageNotification(!messageNotification)
              }
              className="toggle toggle-success"
            />

          </div>

          {/* Call Notification */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <Phone className="text-blue-500" />

              <div>

                <h2 className="font-semibold">
                  Call Notifications
                </h2>

                <p className="text-zinc-400 text-sm">
                  Receive voice and video call alerts.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={callNotification}
              onChange={() =>
                setCallNotification(!callNotification)
              }
              className="toggle toggle-primary"
            />

          </div>

          {/* Desktop Notification */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <Smartphone className="text-yellow-500" />

              <div>

                <h2 className="font-semibold">
                  Desktop Notifications
                </h2>

                <p className="text-zinc-400 text-sm">
                  Show notifications on your desktop.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={desktopNotification}
              onChange={() =>
                setDesktopNotification(!desktopNotification)
              }
              className="toggle toggle-warning"
            />

          </div>

          {/* Notification Sound */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <Volume2 className="text-pink-500" />

              <div>

                <h2 className="font-semibold">
                  Notification Sound
                </h2>

                <p className="text-zinc-400 text-sm">
                  Play sound when a notification arrives.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={sound}
              onChange={() => setSound(!sound)}
              className="toggle toggle-secondary"
            />

          </div>

          {/* Message Preview */}

          <div className="bg-[#202c33] rounded-xl p-5 md:col-span-2">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Bell className="text-red-500" />

                <div>

                  <h2 className="font-semibold">
                    Show Message Preview
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    Display message content inside notifications.
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                checked={preview}
                onChange={() => setPreview(!preview)}
                className="toggle toggle-error"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NotificationSettings;