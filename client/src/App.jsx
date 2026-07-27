import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import StatusPage from "./pages/StatusPage";
import VerifyOtp from "./pages/VerifyOtp";

import PageLoader from "./components/PageLoader";
import CallModal from "./components/CallModal";

import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { useCallStore } from "./store/useCallStore";

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

  const initCallSocket = useCallStore((state) => state.initCallSocket);

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

    if (authUser.theme) {
      setTheme(authUser.theme);
    }

    connectSocket();
    flushOfflineQueue();
    loadChatPrefs();
    initCallSocket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?._id]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="app-shell p-0 lg:p-4">
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <ChatPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/verify-otp"
          element={
            !authUser ? (
              <VerifyOtp />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !authUser ? (
              <SignUpPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/status"
          element={
            authUser ? (
              <StatusPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            authUser?.isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          className: "toast-theme",
          style: {
            borderRadius: "10px",
            fontSize: "13px",
          },
        }}
      />

      {authUser && <CallModal />}
    </div>
  );
}

export default App;