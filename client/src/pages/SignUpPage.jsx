import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, Lock, Mail, User, Loader2 } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="relative text-white w-full flex items-center justify-center">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-fuchsia-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <div className="grid lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 border-r border-white/10">
            <div>
              {/* Logo */}
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

              {/* Heading */}
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

            {/* Feature Cards */}
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

              {/* Header */}
              <div className="mb-10 text-center lg:text-left">
                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Create Account
                </h2>

                <p className="text-slate-400 leading-relaxed">
                  Start your premium messaging experience.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full Name
                  </label>

                  <div className="group relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-cyan-400" />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-cyan-400" />

                    <input
                      id="email"
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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-cyan-400" />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSigningUp ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
