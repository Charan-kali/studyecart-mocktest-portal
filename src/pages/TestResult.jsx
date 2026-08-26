import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getResultById } from "../utils/results";
import { getTestById, getSubjectById } from "../data/sampleData";

export default function TestResult() {
  const { resultId } = useParams();
  const result = getResultById(resultId);
  const test = result ? getTestById(result.testId) : null;
  const subject = test ? getSubjectById(test.subjectId) : null;

  if (!result || !test) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="text-slate2">Report not found.</p>
        </div>
      </AppShell>
    );
  }

  const passed = result.percent >= 60;
  const mm = Math.floor(result.timeTakenSec / 60);
  const ss = result.timeTakenSec % 60;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="bg-paper-light border border-ink/10 rounded-md overflow-hidden">
          <div className="bg-ink px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest">
                {subject?.name} · Score Report
              </p>
              <p className="font-display text-xl font-semibold text-white mt-0.5">{test.title}</p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                passed ? "bg-pass-light text-pass" : "bg-alert-light text-alert"
              }`}
            >
              {passed ? "Cleared" : "Needs review"}
            </span>
          </div>

          <div className="p-6 grid grid-cols-4 gap-4 border-b border-ink/10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate2">Score</p>
              <p className="font-display text-2xl font-semibold mt-1">
                {result.score}/{result.total}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate2">Percent</p>
              <p
                className={`font-display text-2xl font-semibold mt-1 ${
                  passed ? "text-pass" : "text-alert"
                }`}
              >
                {result.percent}%
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate2">Time taken</p>
              <p className="font-display text-2xl font-semibold mt-1 font-mono">
                {mm}:{String(ss).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate2">Submission</p>
              <p className="font-display text-2xl font-semibold mt-1">
                {result.autoSubmitted ? "Auto" : "Manual"}
              </p>
            </div>
          </div>

          <div className="p-6">
            <p className="text-[11px] uppercase tracking-widest text-slate2 mb-3">Answer review</p>
            <div className="space-y-3">
              {test.questions.map((q, i) => {
                const given = result.answers[q.id];
                const correct = q.answer;
                const isCorrect = given === correct;
                return (
                  <div key={q.id} className="border border-ink/10 rounded-sm p-3">
                    <p className="text-sm font-medium">
                      {i + 1}. {q.text}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs">
                      <span className={isCorrect ? "text-pass" : "text-alert"}>
                        Your answer: {given !== undefined ? q.options[given] : "Not answered"}
                      </span>
                      {!isCorrect && (
                        <span className="text-slate2">Correct: {q.options[correct]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-4">
          <Link
            to="/student"
            className="text-sm text-ink-500 hover:text-ink font-medium"
          >
            ← Back to dashboard
          </Link>
          <Link
            to={`/student/test/${test.id}/instructions`}
            className="text-sm text-slate2 hover:text-ink"
          >
            Retake this test
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
