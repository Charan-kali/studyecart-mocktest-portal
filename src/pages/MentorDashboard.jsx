import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import HallTicketCard from "../components/HallTicketCard";
import StatCard from "../components/StatCard";
import { getUserById, TESTS } from "../data/sampleData";
import { getResultsForStudent, getResultsForStudents } from "../utils/results";

export default function MentorDashboard() {
  const { user } = useAuth();
  const students = user.studentIds.map(getUserById);
  const allResults = getResultsForStudents(user.studentIds);
  const [openId, setOpenId] = useState(null);

  const avgAcrossCohort = allResults.length
    ? Math.round(allResults.reduce((s, r) => s + r.percent, 0) / allResults.length)
    : null;
  const atRisk = students.filter((s) => {
    const rs = getResultsForStudent(s.id);
    if (rs.length === 0) return false;
    const avg = rs.reduce((a, r) => a + r.percent, 0) / rs.length;
    return avg < 50;
  });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <HallTicketCard user={user} />

        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard label="Students" value={students.length} />
          <StatCard
            label="Cohort average"
            value={avgAcrossCohort !== null ? `${avgAcrossCohort}%` : "—"}
            accent="#4F68A0"
          />
          <StatCard
            label="Needs attention"
            value={atRisk.length}
            sub="avg below 50%"
            accent="#E1523D"
          />
        </div>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Student roster</h2>
        <div className="space-y-3">
          {students.map((s) => {
            const results = getResultsForStudent(s.id);
            const avg = results.length
              ? Math.round(results.reduce((a, r) => a + r.percent, 0) / results.length)
              : null;
            const isOpen = openId === s.id;
            return (
              <div key={s.id} className="bg-paper-light border border-ink/10 rounded-md overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/40 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center text-white font-display font-semibold shrink-0"
                    style={{ backgroundColor: s.avatarColor }}
                  >
                    {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-xs text-slate2 font-mono">{s.email} · {s.track}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate2">{results.length} attempts</p>
                    <p
                      className={`font-mono font-semibold ${
                        avg === null ? "text-slate2" : avg >= 60 ? "text-pass" : "text-alert"
                      }`}
                    >
                      {avg !== null ? `${avg}% avg` : "No attempts"}
                    </p>
                  </div>
                  <span className="text-slate2 text-xs shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-ink/10 px-4 py-3 bg-white/30">
                    {results.length === 0 ? (
                      <p className="text-sm text-slate2 py-2">This student hasn't attempted any tests yet.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[11px] uppercase tracking-widest text-slate2">
                            <th className="py-1.5 font-medium">Test</th>
                            <th className="py-1.5 font-medium">Date</th>
                            <th className="py-1.5 font-medium">Score</th>
                            <th className="py-1.5 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r) => {
                            const test = TESTS.find((t) => t.id === r.testId);
                            const mm = Math.floor(r.timeTakenSec / 60);
                            const ss = r.timeTakenSec % 60;
                            return (
                              <tr key={r.id} className="border-t border-ink/5">
                                <td className="py-2">{test?.title ?? "Unknown"}</td>
                                <td className="py-2 text-slate2 font-mono text-xs">
                                  {new Date(r.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="py-2">
                                  <span
                                    className={`font-mono font-semibold ${
                                      r.percent >= 60 ? "text-pass" : "text-alert"
                                    }`}
                                  >
                                    {r.score}/{r.total} ({r.percent}%)
                                  </span>
                                </td>
                                <td className="py-2 text-slate2 font-mono text-xs">
                                  {mm}:{String(ss).padStart(2, "0")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
