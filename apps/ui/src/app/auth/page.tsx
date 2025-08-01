"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Signin from "@/app/components/Forms/Auth/Signin";

import Signup from "../components/Forms/Auth/Signup";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../contexts/auth.context";

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="layout-maxed auth-container py-40">
        <div className="loading-page">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="layout-maxed auth-container py-40">
      <div className="md:grid grid-cols-2 py-36">
        <div className="signin-container pb-36 md:pt-0 md:pr-24">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte RentToCraft</p>

          <Signin />
        </div>

        <div className="signup-container pt-36 md:pt-0 md:pl-24">
          <h1>Inscription</h1>
          <p>Créez votre compte RentToCraft</p>

          <Signup />
        </div>
      </div>
    </div>
  );
}
