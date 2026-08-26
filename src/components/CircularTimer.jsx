export default function CircularTimer({ secondsLeft, totalSeconds }) {
  const pct = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  const low = secondsLeft <= 60;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#D6DCEB" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={low ? "#E1523D" : "#F2A93B"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-all duration-1000 ease-linear"
        />
        {/* clock tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + 46 * Math.cos(angle);
          const y1 = 50 + 46 * Math.sin(angle);
          const x2 = 50 + 41 * Math.cos(angle);
          const y2 = 50 + 41 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A9B5D2" strokeWidth="1.5" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-lg font-semibold tabular-nums ${low ? "text-alert" : "text-ink"}`}>
          {mm}:{ss}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate2">left</span>
      </div>
    </div>
  );
}
