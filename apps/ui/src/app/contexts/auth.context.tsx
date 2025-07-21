"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { UserDto } from "@rent-to-craft/dtos";
import { AuthContextType } from "../interfaces/authContext.interface";
import AuthService from "../services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await AuthService.signin(email, password);
      if (result === true) {
        await checkAuthStatus();
        return true;
      }
      throw new Error(typeof result === "string" ? result : "Login failed");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    window.location.href = "/auth/signin";
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string,
  ) => {
    try {
      const result = await AuthService.signup(
        email,
        password,
        firstName,
        lastName,
      );
      if (result === true) {
        return signin(email, password);
      }
      throw new Error(
        typeof result === "string" ? result : "Registration failed",
      );
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signin,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
