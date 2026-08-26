import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Loader2, ShieldCheck } from "lucide-react";
import { getTestById } from "../data/sampleData";

const STEPS = [
  "Loading assessment questions",
  "Syncing assessment timer",
  "Restoring previous progress",
  "Initializing secure test environment",
  "Optimizing workspace",
];

const STEP_MS = 480;

export default function PreparingAssessment() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const test = getTestById(testId);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!test) return;
    if (stepIndex >= STEPS.length) {
      const t = setTimeout(() => navigate(`/student/test/${test.id}`, { replace: true }), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [stepIndex, test, navigate]);

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-white">
        Test not found.
      </div>
    );
  }

  const progressPct = Math.round((Math.min(stepIndex, STEPS.length) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-ink paper-texture flex flex-col items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center mb-3">
          <ShieldCheck className="text-amber" size={26} />
        </div>
        <p className="font-display text-white text-lg font-semibold tracking-tight">StudyEcart Test Simulator</p>
      </div>

      <div className="relative bg-paper-light rounded-[20px] w-full max-w-xl p-10 shadow-2xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-ink/5 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber/10 blur-2xl" />

        <div className="relative flex flex-col gap-8">
          <div className="text-center">
            <p className="font-display text-xl font-semibold text-ink">Preparing your assessment</p>
            <p className="text-sm text-slate2 mt-1">
              Please wait while we securely set up your test environment.
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
            <div
              className="h-full bg-amber rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ul className="flex flex-col gap-4">
            {STEPS.map((label, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <li key={label} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 size={20} className="text-pass shrink-0" />
                  ) : active ? (
                    <Loader2 size={20} className="text-amber-dark shrink-0 animate-spin" />
                  ) : (
                    <Circle size={20} className="text-ink/20 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      done ? "text-ink" : active ? "text-ink font-semibold" : "text-slate2"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-slate2 text-center pt-2 border-t border-ink/10">
            Your assessment is protected with automatic answer sync — nothing is lost if your tab
            reloads.
          </p>
        </div>
      </div>

      <p className="text-white/40 text-xs mt-8">© 2026 StudyEcart Technologies Pvt. Ltd. · Secure Environment</p>
    </div>
  );
}
