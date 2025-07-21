"use client";

import Link from "next/link";
import { useAuth } from "../contexts/auth.context";
import { useRouter } from "next/navigation";

export function Navigation() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container">
        <div className="flex-between py-md">
          <Link href="/" className="text-2xl font-bold text-primary">
            RentToCraft
          </Link>

          <div className="hidden md:flex items-center gap-lg">
            <Link href="/tools" className="text-secondary hover:text-primary">
              Outils
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-secondary hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/tools"
                  className="text-secondary hover:text-primary"
                >
                  Mes outils
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-md">
            {isLoading ? (
              <div>Chargement...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-md">
                <span className="text-secondary">
                  Bonjour, {user?.firstName}
                </span>
                <button onClick={handleLogout} className="btn btn--secondary">
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-secondary hover:text-primary"
                >
                  Connexion
                </Link>
                <Link href="/auth/signup" className="btn btn--primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
