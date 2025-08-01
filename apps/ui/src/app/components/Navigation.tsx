"use client";

import { Facebook, Linkedin, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../contexts/auth.context";
import SiteLogo from "./Icons/SiteLogo";
import OffCanvas from "./OffCanvas";

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
        <>
          <p className="mb-20">{`Bonjour, ${user?.firstName ?? "utilisateur"}`}</p>
          <button onClick={handleLogout} className="btn btn-primary">
            Déconnexion
          </button>
        </>
      );
    }

    return (
      <>
        <Link href="/auth/" className="justify-self-center">
          Connexion / Inscription
        </Link>
      </>
    );
  };

  const burgerBars: React.ReactNode = (
    <span className="burger-open">
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </span>
  );

  return (
    <nav className="layout-maxed">
      <div className="nav-container flex justify-between align-items-center">
        <Link href="/" className="">
          <SiteLogo className="site-logo" />
        </Link>

        <OffCanvas
          buttonContent={burgerBars}
          buttonClassName="burger-open link"
          autoCloseOnClick={true}
        >
          <nav className="offcanvas-nav">
            <Link href="/rental" className="">
              Objets
            </Link>

            <Link href="/about" className="">
              À propos
            </Link>

            <Link href="/contact" className="">
              Contact
            </Link>

            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="">
                  Tableau de bord
                </Link>
                <Link href="/dashboard/tools" className="">
                  Mes outils
                </Link>
              </>
            )}

            <div className="hello tac">{renderAuthSection()}</div>
          </nav>
          <div className="footer flex align-items-center justify-center mt-auto gap-16 socials">
            <Link href="https://www.facebook.com/" target="_blank" className="">
              <Facebook size={30} />
            </Link>
            <Link href="https://x.com/" target="_blank" className="">
              <X size={30} />
            </Link>
            <Link href="https://www.linkedin.com/" target="_blank" className="">
              <Linkedin size={30} />
            </Link>
          </div>
        </OffCanvas>
      </div>
    </nav>
  );
}
