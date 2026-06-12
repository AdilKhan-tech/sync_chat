import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, Lock, Mail, User, Loader2 } from "lucide-react";
import { Link } from "react-router";
import AuthBrandPanel from "../components/AuthBrandPanel";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
                  <h1 className="text-xl font-bold tracking-tight">SyncChat</h1>
                  <p className="text-xs text-zinc-500">Professional messaging</p>
                </div>
              </div>

              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  Create account
                </h2>
                <p className="text-sm text-zinc-500">
                  Join SyncChat and start messaging instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-zinc-400">
                    Full name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-field !pl-11 !h-12"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-400">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field !pl-11 !h-12"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-400">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field !pl-11 !h-12"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="btn-primary w-full !h-12 !text-base"
                >
                  {isSigningUp ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign in
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
