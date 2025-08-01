"use client";

import { ProtectedRoute } from "@/app/components/ProtectedRoute";

export default function AdministrationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ProtectedRoute onlyAdmin>{children}</ProtectedRoute>;
}
