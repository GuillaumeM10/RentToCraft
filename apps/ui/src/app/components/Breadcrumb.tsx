"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";

interface BreadcrumbItem {
  href: string;
  isActive: boolean;
  label: string;
}

const Breadcrumb = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Accueil", href: "/", isActive: false },
    ];

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      let label = segment;

      const labelMap: { [key: string]: string } = {
        auth: "Authentification",
        dashboard: "Tableau de bord",
        administration: "Administration",
        rentals: "Locations",
        categories: "Catégories",
        tools: "Outils",
        rental: "Location",
        categorie: "Catégorie",
        user: "Utilisateur",
        profile: "Profil",
        settings: "Paramètres",
        city: "Ville",
      };

      label =
        labelMap[segment] ??
        segment
          .replaceAll("-", " ")
          .replaceAll(/\b\w/g, (l) => l.toUpperCase());

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center flex-wrap gap-2 text-sm text-gray-600 my-40"
      aria-label="Breadcrumb"
      role="navigation"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          {index > 0 && <span className="text-gray-400 mx-2">/</span>}
          {breadcrumb.isActive ? (
            <span
              className="text-gray-900 font-medium whitespace-nowrap"
              aria-current="page"
            >
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-gray-600 hover:text-gray-900 hover:underline transition-colors whitespace-nowrap"
            >
              {breadcrumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
