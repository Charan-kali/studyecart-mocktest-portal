import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CircularTimer from "../components/CircularTimer";
import { getTestById, getSubjectById } from "../data/sampleData";
import { saveResult } from "../utils/results";

export default function MockTest() {
  const { testId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const test = getTestById(testId);
  const subject = test ? getSubjectById(test.subjectId) : null;

  const totalSeconds = (test?.durationMin ?? 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);

  const submit = useMemo(
    () => (autoSubmitted) => {
      if (submittedRef.current || !test) return;
      submittedRef.current = true;

      let score = 0;
      test.questions.forEach((q) => {
        if (answers[q.id] === q.answer) score += 1;
      });
      const percent = Math.round((score / test.questions.length) * 100);
      const timeTakenSec = Math.round((Date.now() - startedAt.current) / 1000);

      const result = {
        id: `RES-${Date.now()}`,
        studentId: user.id,
        testId: test.id,
        score,
        total: test.questions.length,
        percent,
        timeTakenSec,
        submittedAt: Date.now(),
        answers,
        autoSubmitted,
      };
      saveResult(result);
      navigate(`/student/result/${result.id}`, { replace: true });
    },
    [answers, navigate, test, user]
  );

  useEffect(() => {
    if (!test) return;
    if (secondsLeft <= 0) {
      submit(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, submit, test]);

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-slate2">Test not found.</p>
      </div>
    );
  }

  const q = test.questions[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-ink text-white px-6 py-3 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold">{test.title}</p>
          <p className="text-white/50 text-xs">{subject?.name} · {user.name}</p>
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full py-6 px-6 gap-6">
        <div className="flex-1 bg-paper-light border border-ink/10 rounded-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate2 font-mono">
              Question {current + 1} of {test.questions.length}
            </span>
            <button
              onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                flagged[q.id]
                  ? "bg-amber-light border-amber-dark text-amber-dark"
                  : "border-ink/20 text-slate2 hover:border-ink/40"
              }`}
            >
              {flagged[q.id] ? "Flagged for review" : "Flag for review"}
            </button>
          </div>

          <p className="font-display text-lg leading-relaxed mb-6">{q.text}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className={`w-full text-left px-4 py-3 rounded-sm border flex items-center gap-3 transition-colors ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 hover:border-ink/40 bg-white"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      selected ? "border-white" : "border-ink/30"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="text-sm text-ink-500 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            {current < test.questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => Math.min(test.questions.length - 1, c + 1))}
                className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-sm hover:bg-ink-700 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setConfirmSubmit(true)}
                className="bg-amber text-ink text-sm font-semibold px-4 py-2 rounded-sm hover:bg-amber-dark transition-colors"
              >
                Submit test
              </button>
            )}
          </div>
        </div>

        <aside className="w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-paper-light border border-ink/10 rounded-md p-4 flex items-center gap-4">
            <CircularTimer secondsLeft={Math.max(0, secondsLeft)} totalSeconds={totalSeconds} />
            <div className="text-xs text-slate2">
              <p>{answeredCount} of {test.questions.length} answered</p>
              <p className="mt-1">Auto-submits when time runs out.</p>
            </div>
          </div>

          <div className="bg-paper-light border border-ink/10 rounded-md p-4">
            <p className="text-[11px] uppercase tracking-widest text-slate2 mb-3">Question map</p>
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((qq, i) => {
                const isAnswered = answers[qq.id] !== undefined;
                const isCurrent = i === current;
                const isFlagged = flagged[qq.id];
                return (
                  <button
                    key={qq.id}
                    onClick={() => setCurrent(i)}
                    className={`aspect-square rounded-sm text-xs font-mono flex items-center justify-center border transition-colors relative ${
                      isCurrent
                        ? "border-ink bg-ink text-white"
                        : isAnswered
                        ? "border-pass/40 bg-pass-light text-pass"
                        : "border-ink/15 text-slate2 hover:border-ink/40"
                    }`}
                  >
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setConfirmSubmit(true)}
            className="text-sm text-alert hover:underline text-center"
          >
            End test early
          </button>
        </aside>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50">
          <div className="bg-paper-light rounded-md p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-semibold">Submit this test?</h3>
            <p className="text-sm text-slate2 mt-2">
              You've answered {answeredCount} of {test.questions.length} questions. This can't be undone.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="text-sm text-slate2 px-3 py-2 hover:text-ink"
              >
                Keep working
              </button>
              <button
                onClick={() => submit(false)}
                className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-sm hover:bg-ink-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
