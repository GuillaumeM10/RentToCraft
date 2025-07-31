"use client";

import { useAuth } from "@/app/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "../../LoadingSpinner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const passwordMatch = password === confirmPassword;
  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  // const isPasswordValid = passwordRegex.test(password);
  const isFormValid = passwordMatch && isEmailValid;

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password);
      router.push("/dashboard");
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur d'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group ">
        <label className="form-label" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="form-input "
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="signup-password">
          Mot de passe
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="form-input"
          required
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="signup-confirm-password">
          Confirmer le mot de passe
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="form-input"
          required
          autoComplete="new-password"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {!passwordMatch && password && (
        <p className="error-message">Les mots de passe ne correspondent pas</p>
      )}
      {/* {!isPasswordValid && (
        <p className="error-message">
          Le mot de passe doit contenir au moins 8 caractères, une lettre et un
          chiffre
        </p>
      )} */}
      {!isEmailValid && email && (
        <p className="error-message">Adresse e-mail invalide</p>
      )}

      <button
        type="submit"
        className="btn w-full ml-auto"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? <LoadingSpinner size="small" /> : "Se connecter"}
      </button>
    </form>
  );
};

export default Signup;
