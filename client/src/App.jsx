import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import StatusPage from "./pages/StatusPage";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { useCallStore } from "./store/useCallStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import CallModal from "./components/CallModal";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const {
    connectSocket,
    disconnectSocket,
    setAuthUserId,
    flushOfflineQueue,
    loadChatPrefs,
  } = useChatStore();
  const { initTheme, setTheme } = useSettingsStore();
  const initCallSocket = useCallStore((s) => s.initCallSocket);

  useEffect(() => {
    initTheme();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authUser) {
      disconnectSocket();
      return;
    }

    setAuthUserId(authUser._id);
    if (authUser.theme) setTheme(authUser.theme);
    connectSocket();
    flushOfflineQueue();
    loadChatPrefs();
    initCallSocket();

    // NOTE: intentionally no cleanup/disconnect here.
    // Socket should stay alive for the app's lifetime and only
    // disconnect when authUser becomes null (logout), handled above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?._id]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="app-shell p-0 lg:p-4">
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={authUser?.isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/status"
          element={authUser ? <StatusPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "toast-theme",
          style: { borderRadius: "10px", fontSize: "13px" },
        }}
      />
      {authUser && <CallModal />}
    </div>
  );
}

export default App;
