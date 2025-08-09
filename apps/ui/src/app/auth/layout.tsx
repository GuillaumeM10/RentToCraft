import { ProtectedRoute } from "../components/ProtectedRoute";

const AuthLayout = ({ children }: { readonly children: React.ReactNode }) => {
  return (
    <ProtectedRoute reversed>
      <div className="layout-maxed py-70">{children}</div>
    </ProtectedRoute>
  );
};

export default AuthLayout;
