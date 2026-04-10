import { Link, Navigate, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/hooks/use-theme";
import { Logo } from "@/components/shared/logo";

export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel - hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-primary via-primary/90 to-primary/70 p-10 text-primary-foreground">
        <Logo size="default" className="text-primary-foreground [&_span]:text-primary-foreground" />

        <div className="space-y-4">
          <blockquote className="space-y-3">
            <p className="text-xl leading-relaxed font-medium opacity-95" style={{ fontFamily: "var(--font-display)" }}>
              &ldquo;TaskFlow transformed how our team tracks projects.
              The Kanban board makes it effortless to see where everything
              stands at a glance.&rdquo;
            </p>
            <footer className="text-sm opacity-75">
              &mdash; Jamie Chen, Engineering Lead
            </footer>
          </blockquote>
        </div>

        <div className="flex items-center gap-6 text-sm opacity-60">
          <span>Organize</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>Prioritize</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>Deliver</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="absolute top-4 right-4 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2 lg:hidden text-center">
            <Logo size="lg" className="justify-center" />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="px-0 pt-0 sm:px-6 sm:pt-6">
              <CardTitle className="sr-only">Sign in</CardTitle>
              <CardDescription className="sr-only">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <LoginForm onSuccess={() => navigate("/projects")} />
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground/60">
            Try with <span className="font-mono text-muted-foreground">test@example.com</span> / <span className="font-mono text-muted-foreground">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
