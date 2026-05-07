"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "hbcu" | "superadmin";
  avatar?: string;
  university?: string;
  mascot?: string;
  visibility?: string[];
}

interface UserSwitcherContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  hasVisibility: (feature: string) => boolean;
}

const UserSwitcherContext = createContext<UserSwitcherContextType | undefined>(undefined);

export function UserSwitcherProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    // Initialize from sessionStorage or default to admin
    if (typeof window !== "undefined") {
      const savedUserId = sessionStorage.getItem("svp_user_id");
      const savedRole = sessionStorage.getItem("svp_user_role");
      const savedVisibility = sessionStorage.getItem("svp_user_visibility");
      const savedUniversity = sessionStorage.getItem("svp_user_university");
      const savedMascot = sessionStorage.getItem("svp_user_mascot");
      
      if (savedUserId && savedRole) {
        return {
          id: savedUserId,
          name: savedUniversity || (savedUserId === "admin" ? "System Admin" : "HBCU User"),
          email: savedUserId === "admin" ? "admin@logicore.com" : "admin@hbcu.edu",
          role: savedRole as "admin" | "hbcu" | "superadmin",
          university: savedUniversity || undefined,
          mascot: savedMascot || undefined,
          visibility: savedVisibility ? JSON.parse(savedVisibility) : [],
        };
      }
    }
    
    // Default admin user
    return {
      id: "admin",
      name: "System Admin",
      email: "admin@logicore.com",
      role: "superadmin",
      university: "LogicCore",
      mascot: "System",
      visibility: ["fedsignal", "grants", "academy", "events", "marketing", "team", "analytics", "settings"],
    };
  });

  const hasVisibility = (feature: string): boolean => {
    // Superadmin and admin have access to everything
    if (currentUser.role === "superadmin" || currentUser.role === "admin") {
      return true;
    }
    // HBCU users only have access to their configured visibility
    return currentUser.visibility?.includes(feature) || false;
  };

  return (
    <UserSwitcherContext.Provider value={{ currentUser, setCurrentUser, hasVisibility }}>
      {children}
    </UserSwitcherContext.Provider>
  );
}

export function useUserSwitcher() {
  const context = useContext(UserSwitcherContext);
  if (context === undefined) {
    throw new Error("useUserSwitcher must be used within a UserSwitcherProvider");
  }
  return context;
}
