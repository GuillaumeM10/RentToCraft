"use client";

import Link from "next/link";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <ProtectedRoute>
      <div className="layout-maxed py-70 dashboard-template">
        <nav className="flex gap-20 mb-70">
          <Link
            href="/dashboard/profile"
            className={`dashboard-link ${
              isActive("/dashboard/profile") ? "active" : ""
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
        </nav>
        <div className="min-h-screen">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
