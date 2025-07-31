"use client";

import { useAuth } from "@/app/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "../../LoadingSpinner";

const Signin = () => {
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
    <form onSubmit={handleSubmit}>
      <div className="form-group ">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(thisError) => setEmail(thisError.target.value)}
          className="form-input "
          required
          autoComplete="email"
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
          autoComplete="current-password"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {(!email && email.length > 0) || (!password && password.length > 0) ? (
        <div className="error-message">Veuillez remplir tous les champs</div>
      ) : null}

      <button
        type="submit"
        className="btn btn--primary w-full mb-lg"
        disabled={isLoading || !email || !password}
      >
        {isLoading ? <LoadingSpinner size="small" light /> : "Se connecter"}
      </button>
    </form>
  );
};

export default Signin;
