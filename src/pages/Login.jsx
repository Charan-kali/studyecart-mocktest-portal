import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USERS } from "../data/sampleData";
import logo from "../assets/studyecart-logo.png";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  function goToRolePage(user) {
    navigate(user.role === "student" ? "/student" : "/mentor");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const res = login(email, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      goToRolePage(res.user);
    } else {
      const res = register({ name, email, password, role });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      goToRolePage(res.user);
    }
  }

  function fillDemo(u) {
    setMode("login");
    setEmail(u.email);
    setPassword(u.password);
    setError("");
  }

  return (
    <div className="min-h-screen bg-paper-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-ink/5 p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={logo} alt="StudyEcart" className="h-14 object-contain mb-4" />
            <h1 className="font-display text-2xl font-bold text-ink">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate2 text-sm mt-1">
              {mode === "login"
                ? "Sign in to manage your student records"
                : "Join StudyEcart to start your placement prep"}
            </p>
          </div>

          <div className="flex bg-paper-dark rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "login" ? "bg-white text-ink shadow-sm" : "text-slate2 hover:text-ink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "signup" ? "bg-white text-ink shadow-sm" : "text-slate2 hover:text-ink"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="nameInput">
                  Full name
                </label>
                <input
                  id="nameInput"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-shadow"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="emailInput">
                Email / Username
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate2"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="emailInput"
                  type="email"
                  autoFocus={mode === "login"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studyecart.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-ink" htmlFor="passwordInput">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setError("Password reset isn't wired up in this demo yet.")}
                    className="text-xs font-medium text-brand hover:text-ink-700"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate2"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="passwordInput"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-ink/15 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate2 hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {["student", "mentor"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                        role === r
                          ? "bg-ink text-white border-ink"
                          : "bg-white text-ink border-ink/15 hover:border-ink/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-alert text-xs bg-alert-light rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-2.5 rounded-lg shadow-sm"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>

            <p className="text-[11px] text-slate2 text-center pt-1">
              This is a UI-only demo — accounts are stored in your browser only.
            </p>
          </form>
        </div>

        <details className="mt-5 bg-white rounded-xl border border-ink/10 shadow-sm">
          <summary className="cursor-pointer text-ink/70 text-xs px-4 py-3 select-none font-medium">
            Try a demo account
          </summary>
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            {USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => fillDemo(u)}
                className="text-left bg-paper-dark hover:bg-brand-light border border-ink/10 rounded-lg px-3 py-2 transition-colors"
              >
                <p className="text-ink text-xs font-medium">{u.name}</p>
                <p className="text-slate2 text-[10px] font-mono truncate">{u.email}</p>
                <p className="text-slate2/70 text-[10px] font-mono capitalize">{u.role}</p>
              </button>
            ))}
          </div>
        </details>

        <p className="text-center text-ink/40 text-xs mt-6">
          © 2026 StudyEcart Technologies Pvt. Ltd. — The Digital TPC
        </p>
      </div>
    </div>
  );
}
