"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Plus, 
  X, 
  Users, 
  Shield, 
  Camera, 
  GraduationCap, 
  Award, 
  Target, 
  CheckCircle, 
  Settings,
  Search,
  Trash2,
  Edit,
  UserPlus,
  Key,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { universityList } from "@/lib/fedsignal/utils";

const universityRoles = [
  { id: "vp_research", name: "VP of Research", description: "Research leadership with full access" },
  { id: "researcher", name: "Researcher", description: "Team member with research access" },
  { id: "bd_manager", name: "BD Manager", description: "Business development access" },
  { id: "admin", name: "University Admin", description: "Full university management" },
];

const researchDomains = [
  "Cybersecurity",
  "Artificial Intelligence",
  "Defense R&D",
  "Energy & Environment",
  "Health Sciences",
  "Aerospace",
  "Materials Science",
  "Biotechnology",
  "Data Science",
  "Quantum Computing",
];

interface UniversityUser {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  status: "active" | "pending" | "inactive";
  lastLogin?: string;
  photo?: string;
}

export default function UniversityProfilePage() {
  const params = useParams();
  const router = useRouter();
  const universityId = params.id as string;
  
  // Check if user has seen the welcome modal
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedFundingAreas, setSelectedFundingAreas] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("fedsignal_welcome_seen");
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);
  
  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowWelcomeModal(false);
      sessionStorage.setItem("fedsignal_welcome_seen", "true");
    }
  };
  
  const handleOnboardingSkip = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem("fedsignal_welcome_seen", "true");
  };
  
  const university = universityList.find(u => u.value === universityId) || universityList[0];

  const [profile, setProfile] = useState({
    name: university.label,
    acronym: university.label.split(" ").map((n: string) => n[0]).join(""),
    state: (university as any).state || "TX",
    type: "HBCU",
    researchClassification: "R2",
    enrollment: "1000",
    website: `https://www.${university.value.replace(/-/g, "")}.edu`,
    mascot: university.mascot,
    profilePhoto: university.mascotImage,
    colors: {
      primary: "#003366",
      secondary: "#FF6600",
    },
    govConScore: 76,
    description: `Leading HBCU institution with strong research capabilities in STEM fields and federal contracting opportunities.`,
    primaryDomains: ["Cybersecurity", "Materials Science"],
    contactName: "Dr. James Wilson",
    contactEmail: `research@${university.value.replace(/-/g, "")}.edu`,
    contactPhone: "(512) 478-2000",
    contactTitle: "VP of Research",
  });

  // Load session data on client only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionName = sessionStorage.getItem("svp_user_university");
    const sessionId = sessionStorage.getItem("svp_user_id");
    const sessionMascot = sessionStorage.getItem("svp_user_mascot");
    if (sessionName && sessionId) {
      const matchedUniversity = universityList.find(u => u.value === sessionId);
      setProfile(prev => ({
        ...prev,
        name: sessionName,
        acronym: sessionName.split(" ").map((n: string) => n[0]).join(""),
        state: (matchedUniversity as any)?.state || prev.state,
        website: `https://www.${sessionId.replace(/-/g, "")}.edu`,
        mascot: sessionMascot || prev.mascot,
        profilePhoto: matchedUniversity?.mascotImage || `/mascots/${sessionId}.png`,
        contactEmail: `research@${sessionId.replace(/-/g, "")}.edu`,
      }));
    }
  }, []);

  const [users, setUsers] = useState<UniversityUser[]>([
    { 
      id: "1", 
      name: "Dr. James Wilson", 
      email: "wilson@htu.edu", 
      role: "vp_research", 
      title: "VP of Research", 
      status: "active", 
      lastLogin: "2025-05-05",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: "2", 
      name: "Dr. Sarah Chen", 
      email: "schen@htu.edu", 
      role: "researcher", 
      title: "Senior Researcher", 
      status: "active", 
      lastLogin: "2025-05-04",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    { 
      id: "3", 
      name: "Michael Brown", 
      email: "mbrown@htu.edu", 
      role: "bd_manager", 
      title: "BD Manager", 
      status: "pending",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
  ]);

  const [newDomain, setNewDomain] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "researcher",
    title: "",
    photo: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDomainAdd = () => {
    if (newDomain && !profile.primaryDomains.includes(newDomain)) {
      setProfile({ ...profile, primaryDomains: [...profile.primaryDomains, newDomain] });
      setNewDomain("");
    }
  };

  const handleDomainRemove = (domain: string) => {
    setProfile({ ...profile, primaryDomains: profile.primaryDomains.filter(d => d !== domain) });
  };

  const handleAddUser = () => {
    const user: UniversityUser = {
      id: String(Date.now()),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      status: "pending",
      photo: newUser.photo,
    };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "researcher", title: "", photo: "" });
    setShowAddUserDialog(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get a URL back
      // For now, we'll create a local object URL
      const url = URL.createObjectURL(file);
      setNewUser({ ...newUser, photo: url });
    }
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "vp_research": return "bg-purple-100 text-purple-700 border-purple-200";
      case "researcher": return "bg-blue-100 text-blue-700 border-blue-200";
      case "bd_manager": return "bg-green-100 text-green-700 border-green-200";
      case "admin": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/fedsignal/universities">
              <Settings className="h-4 w-4 mr-1" />
              Back to Universities
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-white overflow-hidden">
              <img
                src={profile.profilePhoto}
                alt={profile.mascot}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-3xl hidden" style={{ backgroundColor: profile.colors.primary }}>{profile.mascot}</div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.acronym} • {profile.type} • {profile.state}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Core details about your institution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Institution Name</Label>
                        <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acronym">Acronym</Label>
                        <Input id="acronym" value={profile.acronym} onChange={(e) => setProfile({ ...profile, acronym: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Institution Type</Label>
                        <Select value={profile.type} onValueChange={(value) => setProfile({ ...profile, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HBCU">HBCU</SelectItem>
                            <SelectItem value="MSI">MSI</SelectItem>
                            <SelectItem value="Tribal">Tribal College</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={profile.state} onValueChange={(value) => setProfile({ ...profile, state: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="DC">Washington DC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="researchClassification">Research Classification</Label>
                        <Select value={profile.researchClassification} onValueChange={(value) => setProfile({ ...profile, researchClassification: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="R1">R1: Very High Research</SelectItem>
                            <SelectItem value="R2">R2: High Research</SelectItem>
                            <SelectItem value="R3">R3: Moderate Research</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enrollment">Enrollment</Label>
                        <Input id="enrollment" value={profile.enrollment} onChange={(e) => setProfile({ ...profile, enrollment: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={4} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Research Domains</CardTitle>
                    <CardDescription>Primary areas of research focus</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Select value={newDomain} onValueChange={setNewDomain}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {researchDomains.filter(d => !profile.primaryDomains.includes(d)).map(domain => (
                            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleDomainAdd} disabled={!newDomain}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.primaryDomains.map(domain => (
                        <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                          {domain}
                          <button onClick={() => handleDomainRemove(domain)} className="ml-1 hover:text-red-500">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Primary Contact</CardTitle>
                    <CardDescription>Main point of contact for the institution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input id="contactName" value={profile.contactName} onChange={(e) => setProfile({ ...profile, contactName: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input id="contactEmail" type="email" value={profile.contactEmail} onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone</Label>
                        <Input id="contactPhone" type="tel" value={profile.contactPhone} onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactTitle">Title</Label>
                      <Input id="contactTitle" value={profile.contactTitle} onChange={(e) => setProfile({ ...profile, contactTitle: e.target.value })} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                    <CardDescription>Choose your avatar - use your school mascot or upload a personal photo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Avatar Preview</Label>
                      <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl border-4" style={{ backgroundColor: profile.colors.primary, borderColor: profile.colors.secondary }}>
                        {profile.profilePhoto ? (
                          <img src={profile.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          profile.mascot
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mascot">School Mascot</Label>
                      <Input id="mascot" value={profile.mascot} onChange={(e) => setProfile({ ...profile, mascot: e.target.value })} maxLength={2} placeholder="🐯" />
                      <p className="text-xs text-muted-foreground">Use an emoji for your school mascot (e.g., 🐯 for Tigers)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profilePhoto">Upload Personal Photo</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="profilePhoto" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfile({ ...profile, profilePhoto: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => setProfile({ ...profile, profilePhoto: "" })}
                          disabled={!profile.profilePhoto}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Upload a personal photo to override the mascot</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Colors and visual identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input id="primaryColor" type="color" value={profile.colors.primary} onChange={(e) => setProfile({ ...profile, colors: { ...profile.colors, primary: e.target.value } })} className="w-20" />
                        <Input value={profile.colors.primary} onChange={(e) => setProfile({ ...profile, colors: { ...profile.colors, primary: e.target.value } })} className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input id="secondaryColor" type="color" value={profile.colors.secondary} onChange={(e) => setProfile({ ...profile, colors: { ...profile.colors, secondary: e.target.value } })} className="w-20" />
                        <Input value={profile.colors.secondary} onChange={(e) => setProfile({ ...profile, colors: { ...profile.colors, secondary: e.target.value } })} className="flex-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GovCon Readiness</CardTitle>
                    <CardDescription>Government contracting readiness score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-5xl font-bold mb-2" style={{ color: profile.colors.primary }}>{profile.govConScore}</div>
                      <p className="text-sm text-muted-foreground">Out of 100</p>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Profile saved successfully
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>University Users</CardTitle>
                    <CardDescription>Manage users associated with this institution</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddUserDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {user.photo ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                            <img
                              src={user.photo}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                              {universityRoles.find(r => r.id === user.role)?.name}
                            </Badge>
                            <Badge className={getStatusBadgeColor(user.status)} variant="outline">
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveUser(user.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities">
            <Card>
              <CardHeader>
                <CardTitle>Research Capabilities</CardTitle>
                <CardDescription>Detailed capability information and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Capability management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>University Settings</CardTitle>
                <CardDescription>Configure university-specific settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Settings configuration coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add University User</DialogTitle>
            <DialogDescription>Create a new user account for this institution</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userPhoto">Profile Photo</Label>
              <div className="flex items-center gap-4">
                {newUser.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={newUser.photo}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="userPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload a profile photo (optional)</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input id="userName" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input id="userEmail" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {universityRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{universityRoles.find(r => r.id === newUser.role)?.description}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userTitle">Title</Label>
              <Input id="userTitle" value={newUser.title} onChange={(e) => setNewUser({ ...newUser, title: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Welcome Onboarding Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {onboardingStep === 0 && "Welcome to FedSignal!"}
              {onboardingStep === 1 && "Set Your Funding Goals"}
              {onboardingStep === 2 && "Your Educational Strengths"}
            </DialogTitle>
            <DialogDescription>
              {onboardingStep === 0 && "Let's get your university profile set up to maximize your funding opportunities."}
              {onboardingStep === 1 && "Tell us about your funding priorities so we can match you with the right opportunities."}
              {onboardingStep === 2 && "Share your research strengths to help us find the best grants for your institution."}
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === onboardingStep ? "w-8 bg-[#4d94ff]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4 py-4">
            {onboardingStep === 0 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#4d94ff]/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#4d94ff]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">You're about to unlock:</h3>
                  <ul className="text-sm text-left space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access to 47+ active federal funding opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered grant matching based on your capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Strategic alerts for upcoming deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Consortium building with partner HBCUs</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Annual Funding Goal</Label>
                  <Input placeholder="e.g., $5,000,000" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Funding Areas (select multiple)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Research Grants", "Contracts", "SBIR/STTR", "Cooperative Agreements"].map((area) => (
                      <button
                        key={area}
                        onClick={() => {
                          if (selectedFundingAreas.includes(area)) {
                            setSelectedFundingAreas(selectedFundingAreas.filter(a => a !== area));
                          } else {
                            setSelectedFundingAreas([...selectedFundingAreas, area]);
                          }
                        }}
                        className={`flex items-center gap-2 p-2 border rounded transition-all ${
                          selectedFundingAreas.includes(area)
                            ? "bg-[#4d94ff] text-white border-[#4d94ff]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">{area}</span>
                        {selectedFundingAreas.includes(area) && <CheckCircle className="h-4 w-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Funding Priorities</Label>
                  <Textarea placeholder="Describe your institution's top funding priorities..." rows={3} />
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Research Domains (select multiple)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {researchDomains.slice(0, 6).map((domain) => (
                      <button
                        key={domain}
                        onClick={() => {
                          if (selectedDomains.includes(domain)) {
                            setSelectedDomains(selectedDomains.filter(d => d !== domain));
                          } else {
                            setSelectedDomains([...selectedDomains, domain]);
                          }
                        }}
                        className={`flex items-center gap-2 p-2 border rounded transition-all ${
                          selectedDomains.includes(domain)
                            ? "bg-[#4d94ff] text-white border-[#4d94ff]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs">{domain}</span>
                        {selectedDomains.includes(domain) && <CheckCircle className="h-3 w-3 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Key Strengths</Label>
                  <Textarea placeholder="Describe your institution's key research strengths and capabilities..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Success Metrics</Label>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">We'll track grant opportunities aligned with your strengths</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleOnboardingSkip}>
              Skip
            </Button>
            <Button onClick={handleOnboardingNext}>
              {onboardingStep === 2 ? "Get Started" : "Continue"}
              {onboardingStep < 2 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
