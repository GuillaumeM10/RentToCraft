"use client";

import { type UserDto } from "@rent-to-craft/dtos";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type AuthContextType } from "../interfaces/authContext.interface";
import AuthService from "../services/auth.service";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const slug = pathname.slice(1).replace(/\//g, "-") || "home";
  const isTransparentOnTop = pathname === "/" || pathname === "/tools";

  const isAuthenticated = !!user;

  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const signin = useCallback(
    async (email: string, password: string) => {
      const result = await AuthService.signin(email, password);
      if (result === true) {
        await checkAuthStatus();
        return true;
      }
      throw new Error(typeof result === "string" ? result : "Login failed");
    },
    [checkAuthStatus],
  );

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    } finally {
      window.location.href = "/auth/signin";
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName?: string,
    ) => {
      const result = await AuthService.signup(
        email,
        password,
        firstName,
        lastName,
      );
      if (result === true) {
        const signinResult = await signin(email, password);
        return signinResult;
      }
      throw new Error(
        typeof result === "string" ? result : "Registration failed",
      );
    },
    [signin],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      signin,
      logout,
      register,
      isTransparentOnTop,
    }),
    [user, isAuthenticated, isLoading, signin, logout, register],
  );

  return (
    <AuthContext.Provider value={value}>
      <Header isTransparentOnTop={!!isTransparentOnTop} />
      <main className={`page-${slug}`}>{children}</main>
      <Footer />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
