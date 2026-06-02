import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, Lock, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLogginIn } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="relative text-white w-full flex items-center justify-center">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-fuchsia-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <div className="grid lg:grid-cols-2">
          {/* Left Side (unchanged) */}
          <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 border-r border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
                  <MessageCircle className="w-7 h-7 text-cyan-300" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    ChatSphere
                  </h1>
                  <p className="text-sm text-slate-400">
                    Premium Messaging Platform
                  </p>
                </div>
              </div>

              <h2 className="text-5xl font-bold leading-tight mb-6">
                Connect.
                <br />
                Chat.
                <br />
                Collaborate.
              </h2>

              <p className="max-w-md text-lg leading-relaxed text-slate-300">
                A premium real-time messaging experience designed for modern
                teams and communities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/[0.07]">
                <h3 className="mb-2 font-semibold">Fast Messaging</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Lightning-fast real-time communication.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/[0.07]">
                <h3 className="mb-2 font-semibold">Secure</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Enterprise-grade encryption and protection.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/20">
                  <MessageCircle className="w-7 h-7 text-cyan-300" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">ChatSphere</h1>
                  <p className="text-sm text-slate-400">Premium Messaging</p>
                </div>
              </div>

              {/* Header FIXED */}
              <div className="mb-10 text-center lg:text-left">
                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Sign In
                </h2>

                <p className="text-slate-400 leading-relaxed">
                  Welcome back — continue your messaging experience.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-cyan-400" />

                    <input
                      name="email"
                      type="email"
                      placeholder="johndoe@gmail.com"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <div className="group relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-cyan-400" />

                    <input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLogginIn}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLogginIn ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Footer FIXED */}
              <p className="mt-8 text-center text-slate-400">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
                >
                  Sign up
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
