import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // Auto redirect intentionally disabled as per your previous code.
  // if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  void isAuthenticated;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.error || "Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.24),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(147,51,234,0.18),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />
        <div className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left Brand / Product Panel */}
        <section className="hidden px-10 py-10 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="flex w-fit items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-base font-semibold shadow-lg shadow-indigo-500/25">
              M
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Majestic Realities</div>
              <div className="text-xs font-medium text-slate-400">Real Estate CRM</div>
            </div>
          </Link>

          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
              Secure CRM access
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
              Run your real estate sales workflow with clarity.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Login to manage leads, customers, tasks, follow-ups and deal pipelines from one professional workspace.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["Leads", "Track every inquiry"],
                ["Tasks", "Never miss follow-ups"],
                ["Deals", "Close faster"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <div className="text-base font-semibold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500">© 2026 Majestic Realities. All rights reserved.</p>
        </section>

        {/* Login Panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <Link to="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-semibold shadow-lg shadow-indigo-500/25">
                M
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">Majestic Realities</div>
                <div className="text-xs font-medium text-slate-400">Real Estate CRM</div>
              </div>
            </Link>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-200 ring-1 ring-indigo-300/20">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">Sign in to continue to your CRM dashboard.</p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5ZM10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0Z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <button type="button" className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200">
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/30"
                    />
                    Remember me
                  </label>
                  <span className="text-xs text-slate-500">Protected access</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500 lg:hidden">
              © 2026 Majestic Realities. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
