"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../contexts/auth.context";

export function Navigation() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const renderAuthSection = () => {
    if (isLoading) {
      return <div>Chargement...</div>;
    }

    if (isAuthenticated) {
      return (
        <div className="flex align-items-center gap-10">
          <span className="">
            {`Bonjour, ${user?.firstName ?? "utilisateur"}`}
          </span>
          <button onClick={handleLogout} className="btn btn--secondary">
            Déconnexion
          </button>
        </div>
      );
    }

    return (
      <>
        <Link href="/auth/signin" className="btn btn-outline-secondary">
          Connexion
        </Link>
        <Link href="/auth/signup" className="btn btn-primary">
          {`S'inscrire`}
        </Link>
      </>
    );
  };

  return (
    <nav className="layout-maxed">
      <div className="nav-container flex justify-between align-items-center">
        <Link href="/" className="">
          RentToCraft
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/tools" className="">
            Outils
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="">
                Dashboard
              </Link>
              <Link href="/dashboard/tools" className="">
                Mes outils
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-16">{renderAuthSection()}</div>

        <div className="offcanvas-container">
          <button type="button" className="burger-open link">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
