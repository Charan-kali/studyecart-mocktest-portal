import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import { SUBJECTS, TESTS } from "../data/sampleData";
import { getResultsForStudent } from "../utils/results";

export default function TestList() {
  const { user } = useAuth();
  const results = getResultsForStudent(user.id);
  const bestByTest = {};
  results.forEach((r) => {
    if (!bestByTest[r.testId] || r.percent > bestByTest[r.testId]) {
      bestByTest[r.testId] = r.percent;
    }
  });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <h1 className="font-display text-2xl font-semibold">Mock tests</h1>
        <p className="text-slate2 text-sm mt-1">Pick a subject and start whenever you're ready.</p>

        {SUBJECTS.map((subject) => {
          const subjectTests = TESTS.filter((t) => t.subjectId === subject.id);
          return (
            <div key={subject.id} className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                <h2 className="font-display text-lg font-semibold">{subject.name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {subjectTests.map((t) => {
                  const best = bestByTest[t.id];
                  return (
                    <div
                      key={t.id}
                      className="bg-paper-light border border-ink/10 rounded-md p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-display font-semibold">{t.title}</p>
                        <p className="text-xs text-slate2 mt-1">
                          {t.questions.length} questions · {t.durationMin} min
                          {best !== undefined && (
                            <span className="ml-2 text-pass font-medium">· best {best}%</span>
                          )}
                        </p>
                      </div>
                      <Link
                        to={`/student/test/${t.id}/instructions`}
                        className="shrink-0 bg-ink text-white text-xs font-semibold px-3 py-2 rounded-sm hover:bg-ink-700 transition-colors"
                      >
                        {best !== undefined ? "Retake" : "Start"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
