"use client";

import { FSSidebar } from "@/components/fedsignal/fs-sidebar";
import { FSTopbar } from "@/components/fedsignal/fs-topbar";
import { useState, useEffect } from "react";
import { universityList } from "@/lib/fedsignal/utils";
import { AuthGuard } from "@/components/portal/auth-guard";

export default function FedSignalLayout({ children }: { children: React.ReactNode }) {
  const [universityId, setUniversityId] = useState("huston-tillotson");

  // Sync with session on mount
  useEffect(() => {
    const sessionId = sessionStorage.getItem("svp_user_id");
    if (sessionId) setUniversityId(sessionId);
  }, []);

  const universityName =
    universityList.find((u) => u.value === universityId)?.label ||
    "Huston-Tillotson University";

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[#f4f6f9]">
        <FSSidebar universityId={universityId} onUniversityChange={setUniversityId} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <FSTopbar title="Command Center" universityName={universityName} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
