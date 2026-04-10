import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "default", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-base",
    default: "text-xl",
    lg: "text-2xl",
  };

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconSizes[size]}
      >
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <rect x="4" y="4" width="24" height="24" rx="4" className="fill-primary" />
        <path
          d="M9 11.5h14"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M9 16.5h10"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M9 21.5h6"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="23" cy="21" r="4" className="fill-primary-foreground" fillOpacity="0.25" />
        <path
          d="M21 21l1.5 1.5L25 19.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            textSizes[size]
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Task<span className="text-primary">Flow</span>
        </span>
      )}
    </span>
  );
}
