import { createContext, useContext, useEffect, useState } from "react";
import { USERS, getUserById, getUserByEmail } from "../data/sampleData";
import { loadJSON, saveJSON, removeJSON } from "../utils/storage";

const AuthContext = createContext(null);

// Extra accounts created via the Sign up form live here, layered on top of
// the seeded USERS list. This is a UI-only stand-in for a real backend —
// swap `login` / `register` for real API calls when one exists.
function loadRegisteredUsers() {
  return loadJSON("registeredUsers", []);
}

function saveRegisteredUsers(users) {
  saveJSON("registeredUsers", users);
}

function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return (
    getUserByEmail(normalized) ||
    loadRegisteredUsers().find((u) => u.email.toLowerCase() === normalized)
  );
}

function findUserById(id) {
  return getUserById(id) || loadRegisteredUsers().find((u) => u.id === id);
}

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => loadJSON("session", null));

  useEffect(() => {
    if (userId) saveJSON("session", userId);
    else removeJSON("session");
  }, [userId]);

  const user = userId ? findUserById(userId) : null;

  function login(email, password) {
    const match = findUserByEmail(email);
    if (!match) {
      return { ok: false, error: "We couldn't find an account with that email." };
    }
    if (match.password !== password) {
      return { ok: false, error: "That password doesn't match. Please try again." };
    }
    setUserId(match.id);
    return { ok: true, user: match };
  }

  function register({ name, email, password, role }) {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return { ok: false, error: "Please fill in your name, email and password." };
    }
    if (findUserByEmail(trimmedEmail)) {
      return { ok: false, error: "An account with that email already exists. Try logging in instead." };
    }

    const registered = loadRegisteredUsers();
    const prefix = role === "mentor" ? "MEN" : "STU";
    const seq = USERS.length + registered.length + 1;
    const id = `${prefix}-${String(seq).padStart(4, "0")}`;
    const avatarColors = ["#4F68A0", "#C9821F", "#1F8A5F", "#6D4FA0", "#E1523D"];
    const avatarColor = avatarColors[seq % avatarColors.length];

    const newUser =
      role === "mentor"
        ? {
            id,
            role: "mentor",
            name: trimmedName,
            email: trimmedEmail,
            password,
            title: "Mentor",
            studentIds: [],
            avatarColor,
          }
        : {
            id,
            role: "student",
            name: trimmedName,
            email: trimmedEmail,
            password,
            track: "General Track",
            mentorId: null,
            avatarColor,
          };

    saveRegisteredUsers([...registered, newUser]);
    setUserId(newUser.id);
    return { ok: true, user: newUser };
  }

  function logout() {
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
