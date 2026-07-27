import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";
import AuthBrandPanel from "../components/AuthBrandPanel";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const { sendOtp, isSendingOtp } = useAuthStore();

  const handleOtpLogin = async () => {
    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    const success = await sendOtp(email);

    if (success) {
      navigate("/verify-otp", {
        state: { email },
      });
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl px-3 sm:px-4 animate-fade-in">
      <div className="auth-card">
        <div className="grid lg:grid-cols-2">
          <AuthBrandPanel />

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">

              <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
                <div className="flex items-center justify-center size-11 rounded-lg bg-accent-soft ring-1 ring-accent-ring">
                  <MessageCircle className="size-5 text-accent-muted" />
                </div>

                <div>
                  <h1 className="text-xl font-bold">SyncChat</h1>
                  <p className="text-xs text-zinc-500">
                    Professional messaging
                  </p>
                </div>
              </div>

              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold theme-text">
                  Welcome Back
                </h2>

                <p className="text-sm theme-text-muted mt-2">
                  Enter your email to receive a one-time verification code.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field !pl-11 !h-12"
                    />
                  </div>
                </div>

                <button
                  onClick={handleOtpLogin}
                  disabled={isSendingOtp}
                  className="btn-primary w-full h-12"
                >
                  {isSendingOtp ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Continue with OTP"
                  )}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-zinc-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Create one
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
