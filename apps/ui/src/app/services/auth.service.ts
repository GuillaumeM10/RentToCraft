import { type UserDto } from "@rent-to-craft/dtos";

type AuthServiceType = {
  getCurrentUser: () => Promise<UserDto | null>;
  isAuthenticated: () => Promise<boolean>;
  logout: () => Promise<void>;
  signin: (email: string, password: string) => Promise<boolean | string>;
  signup: (email: string, password: string) => Promise<boolean | string>;
};

const AuthService: AuthServiceType = {
  signin: async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      }

      const errorMessage =
        typeof data.error === "string"
          ? data.error
          : (data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error) {
      console.log(error);
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  isAuthenticated: async () => {
    try {
      const response = await fetch("/api/auth/me");
      return response.ok;
    } catch {
      return false;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return true;
      }

      return `Erreur: ${data.error ?? "Échec de l'inscription"}`;
    } catch (error) {
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default AuthService;
