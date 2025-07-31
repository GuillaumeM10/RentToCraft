"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../contexts/auth.context";
import { LoadingSpinner } from "./LoadingSpinner";
import { UserRole } from "@rent-to-craft/dtos";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  onlyAdmin?: boolean;
}

export function ProtectedRoute({ children, onlyAdmin }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (onlyAdmin && isAuthenticated && user?.role !== UserRole.administrator) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="loading-page">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
