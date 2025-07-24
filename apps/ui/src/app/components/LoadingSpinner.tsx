interface LoadingSpinnerProps {
  readonly className?: string;
  readonly size?: "large" | "medium" | "small";
}

function getSizeClass(size: "large" | "medium" | "small"): string {
  switch (size) {
    case "large": {
      return "loading-spinner--large";
    }
    case "small": {
      return "loading-spinner--small";
    }
    default: {
      return "";
    }
  }
}

export function LoadingSpinner({
  size = "medium",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClass = getSizeClass(size);

  return <div className={`loading-spinner ${sizeClass} ${className}`} />;
}
