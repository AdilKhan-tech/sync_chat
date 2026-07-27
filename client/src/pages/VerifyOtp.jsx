import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const { verifyOtp, sendOtp } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);

      const success = await verifyOtp(email, otp);

      if (success) {
        toast.success("Login successful");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      const success = await sendOtp(email);

      if (success) {
        toast.success("OTP sent again");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-xl p-8">

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-center opacity-70 mt-2 mb-6">
          We sent a verification code to
        </p>

        <p className="text-center font-semibold mb-6">
          {email}
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="Enter OTP"
            className="input input-bordered w-full text-center text-2xl tracking-[10px] h-14"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-full mt-6 h-12"
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                size={20}
              />
            ) : (
              "Verify OTP"
            )}
          </button>

        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="btn btn-ghost w-full mt-4"
        >
          {resending ? (
            <Loader2
              className="animate-spin"
              size={18}
            />
          ) : (
            "Resend OTP"
          )}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="btn btn-link w-full mt-2"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default VerifyOtp;