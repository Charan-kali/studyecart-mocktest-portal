import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import { TESTS, COURSES, SCHEDULE, getSubjectById } from "../data/sampleData";
import { getResultsForStudent } from "../utils/results";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const results = getResultsForStudent(user.id);
  const attemptedIds = new Set(results.map((r) => r.testId));
  const pending = TESTS.filter((t) => !attemptedIds.has(t.id));
  const companyTests = TESTS.filter((t) => t.subjectId === "company");

  const avgPercent = results.length
    ? Math.round(results.reduce((s, r) => s + r.percent, 0) / results.length)
    : null;
  const readiness = avgPercent ?? 0;

  const firstName = user.name.split(" ")[0];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Hero */}
        <div className="brand-gradient rounded-2xl p-6 md:p-7 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-2xl font-bold">
                {greeting()}, {firstName} 👋
              </h1>
              <p className="text-white/80 text-sm mt-1 max-w-md">
                Continue your placement preparation. Keep the momentum going with today's tasks.
              </p>
              <Link
                to="/student/tests"
                className="inline-block mt-4 bg-white text-brand-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
              >
                Resume recent course
              </Link>
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 mx-auto md:mx-0">
              <p className="text-2xl font-bold leading-none">{readiness}%</p>
              <p className="text-[9px] uppercase tracking-wider text-white/70 mt-1 text-center px-1">
                Readiness score
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <HeroStat label="Tests taken" value={results.length} />
            <HeroStat label="Best score" value={results.length ? `${Math.max(...results.map((r) => r.percent))}%` : "—"} />
            <HeroStat label="Pending tests" value={pending.length} />
            <HeroStat label="Avg. score" value={avgPercent !== null ? `${avgPercent}%` : "—"} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-lg font-semibold">Ready to take</h2>
                <Link to="/student/tests" className="text-sm text-brand hover:text-brand-dark font-medium">
                  View all tests →
                </Link>
              </div>
              <p className="text-slate2 text-xs mb-4">Pick up where you left off.</p>

              {pending.length === 0 ? (
                <p className="text-slate2 text-sm bg-paper-dark rounded-lg p-6 text-center">
                  You've attempted every available mock test. New ones will show up here — check back soon.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {pending.slice(0, 4).map((t) => {
                    const subject = getSubjectById(t.subjectId);
                    return (
                      <Link
                        key={t.id}
                        to={`/student/test/${t.id}/instructions`}
                        className="group bg-white border border-ink/10 rounded-lg p-4 hover:border-brand/40 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${subject.color}1A`, color: subject.color }}
                          >
                            {subject.name}
                          </span>
                          <span className="text-xs font-mono text-slate2">{t.durationMin} min</span>
                        </div>
                        <p className="font-display font-semibold mt-2 group-hover:text-brand transition-colors">
                          {t.title}
                        </p>
                        <p className="text-xs text-slate2 mt-1">{t.questions.length} questions</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Courses */}
            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">My Courses</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {COURSES.map((c) => {
                  const subject = getSubjectById(c.subjectId);
                  const subjectResults = results.filter((r) => {
                    const t = TESTS.find((x) => x.id === r.testId);
                    return t?.subjectId === c.subjectId;
                  });
                  const progress = subjectResults.length
                    ? Math.round(
                        subjectResults.reduce((s, r) => s + r.percent, 0) / subjectResults.length
                      )
                    : 0;
                  return (
                    <div key={c.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
                      <div
                        className="h-20 flex items-center justify-center text-white font-display font-semibold"
                        style={{ backgroundColor: subject?.color || "#146B3D" }}
                      >
                        {c.title}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-slate2">{c.blurb}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] text-slate2 mb-1">
                            <span>Course progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-paper-dark rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          to="/student/tests"
                          className="mt-3 inline-block text-xs font-semibold text-brand hover:text-brand-dark"
                        >
                          Continue learning →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mock Test Simulator */}
            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <h2 className="font-display text-lg font-semibold mb-1">Mock Test Simulator</h2>
              <p className="text-slate2 text-xs mb-4">Company-style assessments, timed like the real thing.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {companyTests.map((t) => {
                  const best = results
                    .filter((r) => r.testId === t.id)
                    .reduce((max, r) => Math.max(max, r.percent), -1);
                  return (
                    <div key={t.id} className="bg-white border border-ink/10 rounded-lg p-4 flex flex-col">
                      <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center text-white font-display font-semibold text-sm mb-3">
                        {t.title[0]}
                      </div>
                      <p className="font-display font-semibold text-sm">{t.title}</p>
                      <p className="text-[11px] text-slate2 mt-1">
                        {t.difficulty || "Standard"} · {t.durationMin} min
                        {best >= 0 && <span className="text-brand font-medium"> · best {best}%</span>}
                      </p>
                      <Link
                        to={`/student/test/${t.id}/instructions`}
                        className="mt-3 text-center bg-ink text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-ink-700 transition-colors"
                      >
                        Start Test
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent results */}
            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <h2 className="font-display text-lg font-semibold mb-3">Recent results</h2>
              {results.length === 0 ? (
                <p className="text-slate2 text-sm bg-paper-dark rounded-lg p-6 text-center">
                  No attempts yet. Take your first mock test to see your report here.
                </p>
              ) : (
                <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-widest text-slate2 border-b border-ink/10">
                        <th className="px-4 py-2.5 font-medium">Test</th>
                        <th className="px-4 py-2.5 font-medium">Date</th>
                        <th className="px-4 py-2.5 font-medium">Score</th>
                        <th className="px-4 py-2.5 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 6).map((r) => {
                        const test = TESTS.find((t) => t.id === r.testId);
                        return (
                          <tr key={r.id} className="border-b border-ink/5 last:border-0">
                            <td className="px-4 py-2.5 font-medium">{test?.title ?? "Unknown test"}</td>
                            <td className="px-4 py-2.5 text-slate2 font-mono text-xs">
                              {new Date(r.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2.5">
                              <span
                                className={`font-mono font-semibold ${
                                  r.percent >= 60 ? "text-pass" : "text-alert"
                                }`}
                              >
                                {r.percent}%
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <Link to={`/student/result/${r.id}`} className="text-brand hover:underline text-xs">
                                View report
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <h2 className="font-display text-base font-semibold mb-3">Today's Schedule</h2>
              <div className="space-y-3">
                {SCHEDULE.map((s) => (
                  <div key={s.id} className="bg-white border border-ink/10 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-brand">
                        {s.tag}
                      </span>
                      <span className="text-[11px] font-mono text-slate2">{s.time}</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{s.title}</p>
                    <p className="text-[11px] text-slate2 mt-0.5">{s.meta}</p>
                    {s.action && (
                      <button className="mt-2 text-[11px] font-semibold text-white bg-brand hover:bg-brand-dark px-2.5 py-1 rounded-md transition-colors">
                        {s.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-paper-light border border-ink/10 rounded-xl p-5">
              <h2 className="font-display text-base font-semibold mb-3">Recent Activity</h2>
              <ul className="space-y-3">
                {results.slice(0, 4).map((r) => {
                  const test = TESTS.find((t) => t.id === r.testId);
                  return (
                    <li key={r.id} className="text-xs text-slate2 flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                      <span>
                        Scored <span className="font-semibold text-ink">{r.percent}%</span> in{" "}
                        <span className="font-medium text-ink">{test?.title ?? "a mock test"}</span>
                        <br />
                        <span className="text-slate2/70">
                          {new Date(r.submittedAt).toLocaleString()}
                        </span>
                      </span>
                    </li>
                  );
                })}
                {results.length === 0 && (
                  <li className="text-xs text-slate2">No activity yet — take a test to get started.</li>
                )}
              </ul>
            </div>

            <div className="bg-ink rounded-xl p-5 text-white">
              <p className="font-display font-semibold text-sm">Need career advice?</p>
              <p className="text-white/70 text-xs mt-1">
                Book a 1-on-1 mentorship session with our placement experts today.
              </p>
              <button className="mt-3 w-full bg-amber hover:bg-amber-dark transition-colors text-ink font-semibold text-xs py-2 rounded-lg">
                Book 1-on-1 Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5">
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/70 mt-1">{label}</p>
    </div>
  );
}
