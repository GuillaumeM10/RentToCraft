import { type UserDto } from "@rent-to-craft/dtos";

import api from "./api.service";
import AppService from "./app.service";

type AuthServiceType = {
  getCurrentUser: () => Promise<UserDto | null>;
  isAuthenticated: () => Promise<boolean>;
  logout: () => Promise<void>;
  signin: (email: string, password: string) => Promise<boolean | string>;
  signup: (email: string, password: string) => Promise<boolean | string>;
};

interface ApiError {
  message?: string;
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface ErrorWithStatus {
  message: string;
  status?: number;
  response?: {
    data?: Record<string, unknown> | string;
    message?: string;
  };
}

const AuthService: AuthServiceType = {
  signin: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signin", { email, password });
      if (response.data?.accessToken) {
        AppService.setCookie("auth-token", response.data.accessToken);
        return true;
      }

      const errorMessage =
        typeof response.data.error === "string"
          ? response.data.error
          : (response.data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.error ??
        (error as Error).message ??
        "Erreur inconnue";
      return `Erreur réseau: ${errorMessage}`;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      AppService.deleteCookie("auth-token");
    }
  },

  isAuthenticated: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.status === 200;
    } catch {
      return false;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signup", { email, password });
      if (response.status === 201 || response.status === 200) {
        return "Inscription réussie";
      }

      return `Erreur: ${response.data.error ?? "Échec de l'inscription"}`;
    } catch (error) {
      return AppService.errorMessages(error as ErrorWithStatus);
    }
  },

  getCurrentUser: async () => {
    try {
      if (typeof window === "undefined") return null;

      const token = AppService.getCookie();
      if (!token) {
        return null;
      }

      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        AppService.deleteCookie("auth-token");
        return null;
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.exp && payload.exp < Date.now() / 1000) {
        AppService.deleteCookie("auth-token");
        return null;
      }

      return {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
      } as UserDto;
    } catch (error) {
      console.error("Error parsing auth token:", error);
      AppService.deleteCookie("auth-token");
      return null;
    }
  },
};

export default AuthService;
