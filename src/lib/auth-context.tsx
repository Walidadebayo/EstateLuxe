"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Define user types
export type UserRole = "user" | "admin" | null;
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password: string;
}

// Define context type
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

// Mock users for demo
const mockUsers: AuthUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    password: "user123",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    password: "admin123",
  },
];

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  console.log("AuthProvider mounted");
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (
    email: string,
    password: string,
    role: UserRole,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user with matching email and role
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.role === role && u.password === password,
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("auth_user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const userExists = mockUsers.some((u) => u.email === email);

    if (userExists) {
      setIsLoading(false);
      return false;
    }

    const newUser: AuthUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role: "user",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      password,
    };

    mockUsers.push(newUser);

    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
