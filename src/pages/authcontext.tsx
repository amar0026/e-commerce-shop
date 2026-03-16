import { createContext, useContext, useState, type ReactNode,  } from "react";

interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  signup: (firstName: string, lastName: string, email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* Mock registered users store */
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { firstName: "Uttam", lastName: "Gupta", email: "uttamgupta628@gmail.com", password: "password123" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ firstName: found.firstName, lastName: found.lastName, email: found.email });
      return true;
    }
    return false;
  };

  const signup = (firstName: string, lastName: string, email: string, password: string) => {
    MOCK_USERS.push({ firstName, lastName, email, password });
    setUser({ firstName, lastName, email });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};