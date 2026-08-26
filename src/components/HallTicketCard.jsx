export default function HallTicketCard({ user }) {
  if (!user) return null;
  const isStudent = user.role === "student";

  return (
    <div className="relative flex bg-paper-light border border-ink/15 rounded-md shadow-sm overflow-hidden">
      <div className="w-2.5 bg-ink relative">
        <div className="absolute inset-y-0 left-full w-0 border-r-2 border-dashed border-white/40" />
      </div>
      <div className="flex-1 p-4 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-sm flex items-center justify-center text-white font-display font-semibold text-lg shrink-0"
          style={{ backgroundColor: user.avatarColor || "#132347" }}
        >
          {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-ink truncate">{user.name}</p>
          <p className="text-xs text-slate2 font-mono tracking-wide truncate">{user.email || user.id}</p>
          <p className="text-xs text-slate2 mt-0.5">{isStudent ? user.track : user.title}</p>
        </div>
        <span className="ml-auto text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full bg-amber-light text-amber-dark stamp-rotate">
          {user.role}
        </span>
      </div>
    </div>
  );
}
