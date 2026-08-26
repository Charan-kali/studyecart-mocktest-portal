export default function StatCard({ label, value, sub, accent = "#132347" }) {
  return (
    <div className="bg-paper-light border border-ink/10 rounded-md p-4">
      <p className="text-[11px] uppercase tracking-widest text-slate2">{label}</p>
      <p className="font-display text-3xl font-semibold mt-1" style={{ color: accent }}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate2 mt-1">{sub}</p>}
    </div>
  );
}
