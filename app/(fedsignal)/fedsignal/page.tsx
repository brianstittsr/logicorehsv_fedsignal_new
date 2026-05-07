"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FSDashboard } from "@/components/fedsignal/fs-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, GraduationCap, Building2, Shield, CheckCircle2, X } from "lucide-react";

const UNIVERSITIES = [
  {
    id: "tuskegee",
    name: "Tuskegee University",
    mascot: "Golden Tigers",
    color: "#8B4513",
    icon: "🐯",
    mascotImage: "/mascots/Tuskeegee-mascot.jpg",
  },
  {
    id: "howard",
    name: "Howard University",
    mascot: "Bison",
    color: "#0000FF",
    icon: "🦬",
    mascotImage: "/mascots/howard.png",
  },
  {
    id: "spelman",
    name: "Spelman College",
    mascot: "Jaguars",
    color: "#800020",
    icon: "🐆",
    mascotImage: "/mascots/spelman.png",
  },
  {
    id: "morehouse",
    name: "Morehouse College",
    mascot: "Maroon Tigers",
    color: "#800000",
    icon: "🐅",
    mascotImage: "/mascots/morehouse.png",
  },
  {
    id: "hampton",
    name: "Hampton University",
    mascot: "Pirates",
    color: "#000080",
    icon: "🏴‍☠️",
    mascotImage: "/mascots/hampton.png",
  },
  {
    id: "famu",
    name: "Florida A&M University",
    mascot: "Rattlers",
    color: "#FF6600",
    icon: "🐍",
    mascotImage: "/mascots/famu.png",
  },
];

const SHARED_PASSWORD = "hbcu2024";

// Static cache-busting version - update this when mascot images change
const CACHE_BUSTER = "v1";

export default function FedSignalPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<typeof UNIVERSITIES[0] | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = sessionStorage.getItem("svp_user_id");
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleUniversityClick = (university: typeof UNIVERSITIES[0]) => {
    setSelectedUniversity(university);
    setShowLogin(true);
    setPassword("");
    setLoginError(false);
  };

  const handleLogin = () => {
    if (password === SHARED_PASSWORD && selectedUniversity) {
      // Set user in session storage
      sessionStorage.setItem("svp_user_id", selectedUniversity.id);
      sessionStorage.setItem("svp_user_role", "hbcu");
      sessionStorage.setItem("svp_user_university", selectedUniversity.name);
      sessionStorage.setItem("svp_user_mascot", selectedUniversity.mascot);
      
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Redirect to profile page
      router.push(`/fedsignal/profile/${selectedUniversity.id}`);
    } else {
      setLoginError(true);
    }
  };

  const handleCancelLogin = () => {
    setShowLogin(false);
    setSelectedUniversity(null);
    setPassword("");
    setLoginError(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Login Dialog */}
          {showLogin && selectedUniversity && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {selectedUniversity.name}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCancelLogin}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Enter the shared password to access FedSignal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center py-4">
                    <div className="text-6xl">{selectedUniversity.icon}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                        className="pl-10"
                      />
                    </div>
                    {loginError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Incorrect password. Please try again.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleCancelLogin}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleLogin}>
                      <Shield className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* University Selection */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="text-4xl font-bold text-white mb-2">FedSignal</h1>
            <p className="text-slate-400">Select your institution to continue</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {UNIVERSITIES.map((university) => (
              <button
                key={university.id}
                onClick={() => handleUniversityClick(university)}
                className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={`${university.mascotImage}?v=${CACHE_BUSTER}`}
                    alt={university.mascot}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="text-5xl hidden">{university.icon}</div>
                </div>
                <div className="text-white font-semibold mb-1">{university.name}</div>
                <div className="text-slate-400 text-sm">{university.mascot}</div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Shield className="h-4 w-4 text-[#1a56db]" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Shared password required for access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <FSDashboard />;
}
