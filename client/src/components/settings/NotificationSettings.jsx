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
        <div className="p-8 text-white max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-zinc-400 mt-2">
                    Control how SyncChat notifies you.
                </p>
            </div>

            <div className="space-y-5">

                {/* Message Notification */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <MessageCircle className="text-green-400" size={24} />

                        <div>
                            <h3 className="font-semibold">Message Notifications</h3>
                            <p className="text-sm text-zinc-400">
                                Receive notifications for new messages.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={messageNotification}
                        onChange={() =>
                            setMessageNotification(!messageNotification)
                        }
                    />
                </div>

                {/* Call Notification */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Phone className="text-blue-400" size={24} />

                        <div>
                            <h3 className="font-semibold">Call Notifications</h3>
                            <p className="text-sm text-zinc-400">
                                Receive incoming voice and video call alerts.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={callNotification}
                        onChange={() =>
                            setCallNotification(!callNotification)
                        }
                    />
                </div>

                {/* Desktop Notification */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Smartphone className="text-yellow-400" size={24} />

                        <div>
                            <h3 className="font-semibold">Desktop Notifications</h3>
                            <p className="text-sm text-zinc-400">
                                Show notifications on your desktop.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-warning"
                        checked={desktopNotification}
                        onChange={() =>
                            setDesktopNotification(!desktopNotification)
                        }
                    />
                </div>

                {/* Sound */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Volume2 className="text-pink-400" size={24} />

                        <div>
                            <h3 className="font-semibold">Notification Sound</h3>
                            <p className="text-sm text-zinc-400">
                                Play a sound when notifications arrive.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-secondary"
                        checked={sound}
                        onChange={() => setSound(!sound)}
                    />
                </div>

                {/* Preview */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Bell className="text-red-400" size={24} />

                        <div>
                            <h3 className="font-semibold">
                                Show Message Preview
                            </h3>

                            <p className="text-sm text-zinc-400">
                                Display message content inside notifications.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-error"
                        checked={preview}
                        onChange={() => setPreview(!preview)}
                    />
                </div>

            </div>
        </div>
    );
}

export default NotificationSettings;