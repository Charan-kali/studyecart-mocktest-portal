import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TestList from "./pages/TestList";
import AssessmentInstructions from "./pages/AssessmentInstructions";
import PreparingAssessment from "./pages/PreparingAssessment";
import MockTest from "./pages/MockTest";
import TestResult from "./pages/TestResult";
import MentorDashboard from "./pages/MentorDashboard";

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "student" ? "/student" : "/mentor"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/tests"
            element={
              <ProtectedRoute role="student">
                <TestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/test/:testId/instructions"
            element={
              <ProtectedRoute role="student">
                <AssessmentInstructions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/test/:testId/preparing"
            element={
              <ProtectedRoute role="student">
                <PreparingAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/test/:testId"
            element={
              <ProtectedRoute role="student">
                <MockTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/result/:resultId"
            element={
              <ProtectedRoute role="student">
                <TestResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute role="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
