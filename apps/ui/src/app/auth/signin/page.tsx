"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/auth.context";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signin(email, password);
      router.push("/dashboard");
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h1>Connexion</h1>
        <p>Connectez-vous à votre compte RentToCraft</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(thisError) => setEmail(thisError.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(thisError) => setPassword(thisError.target.value)}
            className="form-input"
            required
          />
        </div>

        {error && <div className="form-error mb-lg">{error}</div>}

        <button
          type="submit"
          className="btn btn--primary w-full mb-lg"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="small" /> : "Se connecter"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-secondary">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="text-primary">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
