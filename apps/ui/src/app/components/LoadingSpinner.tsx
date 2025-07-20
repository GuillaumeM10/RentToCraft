interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingSpinner({
  size = "medium",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClass =
    size === "small"
      ? "loading-spinner--small"
      : size === "large"
        ? "loading-spinner--large"
        : "";

  return <div className={`loading-spinner ${sizeClass} ${className}`} />;
}
