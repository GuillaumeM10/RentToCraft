"use client";

import { UserRole } from "@rent-to-craft/dtos";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Breadcrumb from "../components/Breadcrumb";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../contexts/auth.context";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const adminLinks = user?.role === UserRole.administrator && (
    <>
      <Link
        href="/dashboard/administration/rentals/categories"
        className={`dashboard-link ${
          isActive("/dashboard/administration/rentals/categories")
            ? "active"
            : ""
        }`}
      >
        Catégories de locations
      </Link>
      <Link
        href="/dashboard/administration/users"
        className={`dashboard-link ${
          isActive("/dashboard/administration/users") ? "active" : ""
        }`}
      >
        Utilisateurs
      </Link>
    </>
  );

  return (
    <ProtectedRoute>
      <div className="layout-maxed py-70 dashboard-template overflow-hidden">
        <nav className="gap-20 overflow-custom">
          <Link
            href="/dashboard"
            className={`dashboard-link ${
              isActive("/dashboard") ? "active" : ""
            }`}
          >
            Profil
          </Link>
          <Link
            href="/dashboard/rentals"
            className={`dashboard-link ${
              isActive("/dashboard/rentals") ? "active" : ""
            }`}
          >
            Mes locations
          </Link>
          <Link
            href="/dashboard/tools"
            className={`dashboard-link ${
              isActive("/dashboard/tools") ? "active" : ""
            }`}
          >
            Mes objets
          </Link>

          {adminLinks}
        </nav>
        <Breadcrumb />
        <div className="min-h-screen">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
