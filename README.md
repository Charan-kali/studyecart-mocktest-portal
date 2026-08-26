# Praxis — Mock Test Portal

A React app for student mock tests with role-based dashboards for **students** and **mentors**.

## Stack
- React 19 + Vite
- React Router v6
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- No backend: auth and data persistence use `localStorage` (see `src/utils/storage.js`)

## Getting started
```bash
npm install
npm run dev
```
Then open the printed local URL. To build for production: `npm run build` (output in `dist/`).

## Demo logins
No password is required — the login screen ("Admit Card Login") accepts an ID:

| ID | Role | Name |
|---|---|---|
| `STU-2201` | Student | Ananya Rao |
| `STU-2202` | Student | Kabir Malhotra |
| `STU-2203` | Student | Meera Iyer |
| `MEN-01` | Mentor | Dr. Sameer Kulkarni (mentors STU-2201, STU-2202) |
| `MEN-02` | Mentor | Prof. Lakshmi Nair (mentors STU-2203) |

The login screen has a "Try a demo ID" drawer that fills these in for you.

## What's included
- **Login** — role-based, ID-only "admit card" style lookup (`src/pages/Login.jsx`)
- **Student dashboard** — stats, pending tests, recent results (`src/pages/StudentDashboard.jsx`)
- **Test catalogue** — all mock tests grouped by subject (`src/pages/TestList.jsx`)
- **Assessment instructions** — pattern breakdown, passing criteria, negative-marking notice, system readiness check, candidate card, "I've read this" gate before launch (`src/pages/AssessmentInstructions.jsx`)
- **Preparing assessment** — staged loading screen (loading questions, syncing timer, etc.) between instructions and the live test (`src/pages/PreparingAssessment.jsx`)
- **Test-taking screen** — timed MCQs, question navigator, flag-for-review, auto-submit on timeout (`src/pages/MockTest.jsx`)
- **Score report** — per-question review after submission (`src/pages/TestResult.jsx`)
- **Mentor dashboard** — roster of assigned students, expandable per-student result history (`src/pages/MentorDashboard.jsx`)

### Student flow
```
Dashboard / Test catalogue
      ↓
Assessment Instructions  (/student/test/:testId/instructions)
      ↓ (agree to terms → Begin assessment)
Preparing Assessment     (/student/test/:testId/preparing)
      ↓ (auto-advances after setup steps)
Mock Test                (/student/test/:testId)
      ↓ (submit or time runs out)
Score Report              (/student/result/:resultId)
```

## Data
- `src/data/sampleData.js` — students, mentors, subjects, and question banks. Edit this to add real questions/users, or swap it for an API call later.
- `src/utils/results.js` — reads/writes test attempts to `localStorage` under the `praxis:results` key.
- `src/context/AuthContext.jsx` — mock session logic. This is the file to replace when you wire up real authentication (JWT/OAuth/etc.) — everything else consumes `useAuth()` and doesn't care how the session was established.

## Persistence note
All test results and the logged-in session persist in the browser's `localStorage`, scoped to whichever browser/device the student uses. Clearing site data resets progress. There's no cross-device sync since there's no backend yet — that's the natural next step (a small API + database swapped into `AuthContext` and `results.js`).

## Extending
- Add more tests/questions: edit the `TESTS` array in `sampleData.js`.
- Add more students/mentors: edit `USERS` and set `mentorId` (student → mentor) or `studentIds` (mentor → students).
- Real backend: replace the bodies of `login()` in `AuthContext.jsx` and the functions in `results.js` with API calls — the rest of the app is already written against those interfaces.
