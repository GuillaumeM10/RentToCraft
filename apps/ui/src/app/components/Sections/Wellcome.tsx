"use client";
import { useAuth } from "@/app/contexts/auth.context";
import Link from "next/link";

const Wellcome = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return null;
  }
  return (
    <div className="wellcome py-70">
      <h2 className="text-center">Bienvenue sur RentToCraft</h2>
      <p className="text-center my-36">
        Connectez-vous pour accéder à votre tableau de bord et gérer vos outils
      </p>
      <div className="flex justify-center mt-4 gap-10">
        <Link href="/auth/signin" className="btn btn-secondary">
          Connexion
        </Link>
        <Link href="/auth/signup" className="btn btn-primary ml-4">
          S'inscrire
        </Link>
      </div>
    </div>
  );
};

export default Wellcome;
