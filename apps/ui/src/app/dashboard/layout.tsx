import { ProtectedRoute } from "../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary">
        <div className="container py-xl">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
