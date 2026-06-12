import { Routes, Route, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { connectSocket, disconnectSocket, setAuthUserId, flushOfflineQueue, loadChatPrefs } = useChatStore();
  const { initTheme, setTheme } = useSettingsStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [checkAuth, initTheme]);

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
    return () => disconnectSocket();
  }, [authUser, connectSocket, disconnectSocket, setAuthUserId, flushOfflineQueue, loadChatPrefs, setTheme]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="app-shell p-0 lg:p-4">
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/admin" element={authUser?.isAdmin ? <AdminPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "toast-theme",
          style: { borderRadius: "10px", fontSize: "13px" },
        }}
      />
    </div>
  );
}

export default App;
