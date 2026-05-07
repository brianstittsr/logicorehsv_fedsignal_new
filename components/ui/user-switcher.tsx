"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, ChevronDown, LogOut } from "lucide-react";

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

interface UserSwitcherProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export function UserSwitcher({ currentUser, onUserChange }: UserSwitcherProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Load users from localStorage or use default users
    const savedUsers = localStorage.getItem("svp_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers: UserProfile[] = [
        {
          id: "admin",
          name: "System Admin",
          email: "admin@logicore.com",
          role: "superadmin",
          university: "LogicCore",
          mascot: "System",
          visibility: ["fedsignal", "grants", "academy", "events", "marketing", "team", "analytics", "settings"],
        },
        {
          id: "tuskegee",
          name: "Tuskegee University",
          email: "admin@tuskegee.edu",
          role: "hbcu",
          university: "Tuskegee University",
          mascot: "Golden Tigers",
          visibility: ["fedsignal", "grants", "academy"],
        },
        {
          id: "howard",
          name: "Howard University",
          email: "admin@howard.edu",
          role: "hbcu",
          university: "Howard University",
          mascot: "Bison",
          visibility: ["fedsignal", "grants", "events"],
        },
        {
          id: "spelman",
          name: "Spelman College",
          email: "admin@spelman.edu",
          role: "hbcu",
          university: "Spelman College",
          mascot: "Jaguars",
          visibility: ["fedsignal", "academy", "team"],
        },
        {
          id: "morehouse",
          name: "Morehouse College",
          email: "admin@morehouse.edu",
          role: "hbcu",
          university: "Morehouse College",
          mascot: "Maroon Tigers",
          visibility: ["fedsignal", "grants", "academy", "events"],
        },
        {
          id: "hampton",
          name: "Hampton University",
          email: "admin@hampton.edu",
          role: "hbcu",
          university: "Hampton University",
          mascot: "Pirates",
          visibility: ["fedsignal", "grants", "team"],
        },
        {
          id: "famu",
          name: "Florida A&M University",
          email: "admin@famu.edu",
          role: "hbcu",
          university: "Florida A&M University",
          mascot: "Rattlers",
          visibility: ["fedsignal", "grants", "academy"],
        },
      ];
      setUsers(defaultUsers);
      localStorage.setItem("svp_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleUserSwitch = (user: UserProfile) => {
    onUserChange(user);
    sessionStorage.setItem("svp_user_role", user.role);
    sessionStorage.setItem("svp_user_id", user.id);
    sessionStorage.setItem("svp_user_visibility", JSON.stringify(user.visibility || []));
    if (user.mascot) {
      sessionStorage.setItem("svp_user_mascot", user.mascot);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin": return "bg-purple-100 text-purple-700";
      case "admin": return "bg-blue-100 text-blue-700";
      case "hbcu": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="text-xs">{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{currentUser.name}</span>
          <Badge variant="outline" className={getRoleBadgeColor(currentUser.role)}>
            {currentUser.role}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Switch User
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => handleUserSwitch(user)}
            className={currentUser.id === user.id ? "bg-muted" : ""}
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
              <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
