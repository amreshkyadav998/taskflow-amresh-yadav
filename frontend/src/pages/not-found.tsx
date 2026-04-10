import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-7xl font-bold text-primary/20" style={{ fontFamily: "var(--font-display)" }}>
        404
      </p>
      <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Page not found
      </h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild variant="outline" className="mt-6 gap-2">
        <Link to="/projects">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </Button>
    </div>
  );
}
