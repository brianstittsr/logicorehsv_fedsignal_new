"use client";

import { useUserProfile } from "@/contexts/user-profile-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, linkedTeamMember } = useUserProfile();
  const router = useRouter();
  const [sessionRole, setSessionRole] = useState<string | null>(null);

  // Check sessionStorage for demo user role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("svp_user_role");
      setSessionRole(role);
    }
  }, []);

  const isAdmin = linkedTeamMember?.role === "admin" ||
                  linkedTeamMember?.role === "superadmin" ||
                  sessionRole === "admin" ||
                  sessionRole === "superadmin";

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/portal");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access admin pages.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
