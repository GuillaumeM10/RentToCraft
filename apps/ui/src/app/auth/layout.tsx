export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">{children}</div>
    </div>
  );
}
