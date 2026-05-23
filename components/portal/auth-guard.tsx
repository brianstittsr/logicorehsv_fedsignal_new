"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Simple sessionStorage-based auth check
// BYPASS: Always return true for development
function isDemoAuthenticated(): boolean {
  return true;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const auth = isDemoAuthenticated();
    setIsAuthenticated(auth);
    setIsLoading(false);

    if (!auth) {
      // Check if this is a fedsignal path - redirect to homepage (login modal)
      // otherwise redirect to sign-in for portal paths
      const pathname = window.location.pathname;
      if (pathname.startsWith("/fedsignal")) {
        router.push("/");
      } else {
        router.push("/sign-in");
      }
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
