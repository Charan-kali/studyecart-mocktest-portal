import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/studyecart-logo.png";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const isStudent = user?.role === "student";

  const navItems = isStudent
    ? [
        { to: "/student", label: "Dashboard", icon: HomeIcon },
        { to: "/student/tests", label: "Mock Tests", icon: TestIcon },
      ]
    : [{ to: "/mentor", label: "Dashboard", icon: HomeIcon }];

  return (
    <div className="min-h-screen flex bg-paper-dark">
      <aside className="w-60 shrink-0 bg-white border-r border-ink/10 flex flex-col">
        <div className="px-5 py-5 border-b border-ink/10">
          <img src={logo} alt="StudyEcart" className="h-9 object-contain" />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-brand-light text-brand-dark font-semibold"
                    : "text-slate2 hover:bg-paper-dark hover:text-ink"
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-ink/10 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-semibold text-xs shrink-0"
            style={{ backgroundColor: user?.avatarColor || "#146B3D" }}
          >
            {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink font-medium truncate">{user?.name}</p>
            <button
              onClick={logout}
              className="text-[11px] text-brand hover:text-brand-dark font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

function HomeIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    </svg>
  );
}

function TestIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
