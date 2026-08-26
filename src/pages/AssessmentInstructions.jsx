import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CheckCircle2, MonitorCheck, Wifi, ShieldAlert, Maximize2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import HallTicketCard from "../components/HallTicketCard";
import { getTestById, getSubjectById } from "../data/sampleData";

const PASS_CUTOFF = 60;

export default function AssessmentInstructions() {
  const { testId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const test = getTestById(testId);
  const subject = test ? getSubjectById(test.subjectId) : null;
  const [agreed, setAgreed] = useState(false);

  if (!test) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-8 py-16 text-center text-slate2">Test not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3 mb-1">
          <span
            className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${subject.color}1A`, color: subject.color }}
          >
            {subject.name}
          </span>
          <span className="text-xs text-slate2 font-mono">{test.id}</span>
        </div>
        <h1 className="font-display text-2xl font-semibold">{test.title}</h1>
        <p className="text-slate2 text-sm mt-1">
          Read the instructions below before you begin. The timer starts the moment you launch the test.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Left: pattern + rules */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="bg-paper-light border border-ink/10 rounded-md p-5">
              <h2 className="font-display text-lg font-semibold mb-3">Assessment pattern</h2>
              <div className="rounded-sm overflow-hidden border border-ink/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink/[0.04] text-left text-[11px] uppercase tracking-widest text-slate2">
                      <th className="px-4 py-2.5 font-medium">Section</th>
                      <th className="px-4 py-2.5 font-medium">Questions</th>
                      <th className="px-4 py-2.5 font-medium">Duration</th>
                      <th className="px-4 py-2.5 font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-ink/10">
                      <td className="px-4 py-3">{subject.name}</td>
                      <td className="px-4 py-3 font-mono">{test.questions.length}</td>
                      <td className="px-4 py-3 font-mono">{test.durationMin} mins</td>
                      <td className="px-4 py-3">MCQ</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-ink/[0.04] border-t border-ink/10 font-semibold">
                      <td className="px-4 py-2.5">Total</td>
                      <td className="px-4 py-2.5 font-mono">{test.questions.length}</td>
                      <td className="px-4 py-2.5 font-mono">{test.durationMin} mins</td>
                      <td className="px-4 py-2.5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-paper-light border border-ink/10 rounded-md p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-pass" />
                  <h3 className="font-display font-semibold">Passing criteria</h3>
                </div>
                <p className="text-sm text-slate2">
                  Overall cut-off is {PASS_CUTOFF}%. Your score is calculated from correctly answered
                  questions only.
                </p>
              </div>
              <div className="bg-paper-light border border-alert/20 rounded-md p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={18} className="text-alert" />
                  <h3 className="font-display font-semibold">Negative marking</h3>
                </div>
                <p className="text-sm text-slate2">
                  There is no negative marking on this assessment. You're encouraged to attempt every
                  question.
                </p>
              </div>
            </div>
          </div>

          {/* Right: readiness + candidate + launch */}
          <div className="flex flex-col gap-4">
            <div className="bg-paper-light border border-ink/10 rounded-md p-5">
              <h3 className="font-display font-semibold mb-3">System readiness</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate2">
                    <MonitorCheck size={16} /> Browser
                  </span>
                  <span className="text-pass font-medium">Supported</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate2">
                    <Wifi size={16} /> Connection
                  </span>
                  <span className="text-pass font-medium">Good</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate2">
                    <Maximize2 size={16} /> Full screen
                  </span>
                  <span className="text-slate2 font-medium">Recommended</span>
                </li>
              </ul>
            </div>

            <HallTicketCard user={user} />

            <div className="bg-paper-light border border-ink/10 rounded-md p-5">
              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-ink"
                />
                <span className="text-slate2">
                  I have read and understood the assessment pattern and rules above. I understand the
                  timer cannot be paused once started.
                </span>
              </label>

              <button
                disabled={!agreed}
                onClick={() => navigate(`/student/test/${test.id}/preparing`)}
                className="w-full mt-4 bg-ink text-white font-semibold py-2.5 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink-700 transition-colors"
              >
                Begin assessment
              </button>
              <Link
                to="/student/tests"
                className="block text-center text-xs text-slate2 hover:text-ink mt-3"
              >
                ← Choose a different test
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
