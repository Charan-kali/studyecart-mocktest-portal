import { loadJSON, saveJSON } from "./storage";

const KEY = "results";

// Shape of a result record:
// { id, studentId, testId, score, total, percent, timeTakenSec, submittedAt, answers: {qId: optionIndex|null}, autoSubmitted }

export function getAllResults() {
  return loadJSON(KEY, []);
}

export function getResultsForStudent(studentId) {
  return getAllResults()
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.submittedAt - a.submittedAt);
}

export function getResultsForStudents(studentIds) {
  return getAllResults()
    .filter((r) => studentIds.includes(r.studentId))
    .sort((a, b) => b.submittedAt - a.submittedAt);
}

export function saveResult(result) {
  const all = getAllResults();
  all.push(result);
  saveJSON(KEY, all);
  return result;
}

export function getResultById(id) {
  return getAllResults().find((r) => r.id === id);
}
