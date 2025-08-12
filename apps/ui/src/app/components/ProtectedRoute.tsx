"use client";

import { UserRole } from "@rent-to-craft/dtos";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../contexts/auth.context";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly onlyAdmin?: boolean;
  readonly reversed?: boolean;
}

export function ProtectedRoute({
  children,
  onlyAdmin,
  reversed = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (onlyAdmin && isAuthenticated && user?.role !== UserRole.administrator) {
      router.push("/dashboard");
    }
    if (reversed && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, onlyAdmin, user?.role, reversed]);

  if (isLoading) {
    return (
      <div className="loading-page layout-maxed justify-items-center h-96 align-items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated && !reversed) {
    return null;
  }

  if (reversed && isAuthenticated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
