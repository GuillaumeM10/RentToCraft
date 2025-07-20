"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signin(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
