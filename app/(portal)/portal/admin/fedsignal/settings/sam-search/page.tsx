"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X, Search, Building2, Tag, MapPin, Calendar, CheckCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FSCOLLECTIONS, FSSamSearchSettingsDoc } from "@/lib/fedsignal/schema";

interface SamSearchSettings {
  enabled: boolean;
  
  // Contract opportunity categories
  contractCategories: string[];
  
  // Notice types
  noticeTypes: string[];
  
  // NAICS codes
  naicsCodes: Array<{ code: string; description: string }>;
  
  // Set-asides
  setAsides: string[];
  
  // Target agencies
  targetAgencies: string[];
  
  // Search keywords (capability areas, research areas, faculty expertise)
  searchKeywords: string[];
  
  // BAA settings
  enableBAA: boolean;
  baaKeywords: string[];
  
  // Place of performance states
  popStates: string[];
  
  // Date ranges
  responseDateDays: number;
  postedDateDays: number;
}

const DEFAULT_NAICS_CODES = [
  { code: "611310", description: "Colleges, Universities, and Professional Schools" },
  { code: "541715", description: "R&D in Physical, Engineering, and Life Sciences" },
  { code: "541611", description: "Administrative Management Consulting" },
  { code: "611420", description: "Computer Training" },
  { code: "541512", description: "Computer Systems Design" },
  { code: "611430", description: "Professional and Management Development Training" },
  { code: "541330", description: "Engineering Services" },
];

const CONTRACT_CATEGORIES = [
  "Research contracts",
  "Training and workforce development programs",
  "STEM education initiatives",
  "IT and cybersecurity services",
  "Manufacturing and engineering support",
  "AI/robotics initiatives",
  "Environmental and sustainability projects",
  "Grant-related support contracts",
];

const NOTICE_TYPES = [
  "Sources Sought",
  "Request for Proposal (RFP)",
  "Request for Quote (RFQ)",
  "Broad Agency Announcement (BAA)",
  "Presolicitation",
  "Solicitation",
];

const SET_ASIDES = [
  "HBCU",
  "8(a)",
  "WOSB",
  "HUBZone",
  "SDVOSB",
  "VOSB",
];

const TARGET_AGENCIES = [
  "National Science Foundation (NSF)",
  "Department of Defense (DoD)",
  "Department of Energy (DOE)",
  "National Aeronautics and Space Administration (NASA)",
  "Department of Education",
  "National Institute of Standards and Technology (NIST)",
  "Economic Development Administration (EDA)",
  "Department of Homeland Security (DHS)",
  "Department of Health and Human Services (HHS)",
];

const BAA_KEYWORDS = [
  "BAA",
  "Research",
  "Innovation",
  "University",
  "STEM",
  "Artificial Intelligence",
  "Advanced Manufacturing",
  "Quantum Computing",
  "Biotechnology",
  "Cybersecurity",
];

const CAPABILITY_KEYWORDS = [
  "advanced manufacturing",
  "digital twin",
  "robotics training",
  "cybersecurity workforce",
  "AI curriculum",
  "semiconductor",
  "clean energy",
  "workforce development",
  "industry partnerships",
  "faculty expertise",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export default function SamSearchSettingsPage() {
  const [settings, setSettings] = useState<SamSearchSettings>({
    enabled: true,
    contractCategories: CONTRACT_CATEGORIES.slice(0, 4),
    noticeTypes: ["Sources Sought", "Presolicitation", "Solicitation"],
    naicsCodes: DEFAULT_NAICS_CODES.slice(0, 3),
    setAsides: ["HBCU", "8(a)"],
    targetAgencies: ["National Science Foundation (NSF)", "Department of Defense (DoD)", "Department of Energy (DOE)"],
    searchKeywords: CAPABILITY_KEYWORDS.slice(0, 5),
    enableBAA: true,
    baaKeywords: BAA_KEYWORDS.slice(0, 5),
    popStates: ["AL", "GA", "TX", "NC"],
    responseDateDays: 30,
    postedDateDays: 90,
  });

  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newBaaKeyword, setNewBaaKeyword] = useState("");
  const [newNaicsCode, setNewNaicsCode] = useState("");
  const [newNaicsDesc, setNewNaicsDesc] = useState("");

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!db) return;
      
      try {
        const docRef = doc(db, FSCOLLECTIONS.SAM_SEARCH_SETTINGS, "default");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as FSSamSearchSettingsDoc;
          setSettings({
            enabled: data.enabled,
            contractCategories: data.contractCategories,
            noticeTypes: data.noticeTypes,
            naicsCodes: data.naicsCodes,
            setAsides: data.setAsides,
            targetAgencies: data.targetAgencies,
            searchKeywords: data.searchKeywords,
            enableBAA: data.enableBAA,
            baaKeywords: data.baaKeywords,
            popStates: data.popStates,
            responseDateDays: data.responseDateDays,
            postedDateDays: data.postedDateDays,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!db) {
      toast.error("Firebase not initialized");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, FSCOLLECTIONS.SAM_SEARCH_SETTINGS, "default");
      const settingsData: FSSamSearchSettingsDoc = {
        id: "default",
        enabled: settings.enabled,
        contractCategories: settings.contractCategories,
        noticeTypes: settings.noticeTypes,
        naicsCodes: settings.naicsCodes,
        setAsides: settings.setAsides,
        targetAgencies: settings.targetAgencies,
        searchKeywords: settings.searchKeywords,
        enableBAA: settings.enableBAA,
        baaKeywords: settings.baaKeywords,
        popStates: settings.popStates,
        responseDateDays: settings.responseDateDays,
        postedDateDays: settings.postedDateDays,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      await setDoc(docRef, settingsData, { merge: true });
      toast.success("SAM.gov search settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = (keyword: string, type: "search" | "baa") => {
    if (!keyword.trim()) return;
    
    if (type === "search") {
      if (!settings.searchKeywords.includes(keyword.trim())) {
        setSettings({
          ...settings,
          searchKeywords: [...settings.searchKeywords, keyword.trim()]
        });
      }
      setNewKeyword("");
    } else {
      if (!settings.baaKeywords.includes(keyword.trim())) {
        setSettings({
          ...settings,
          baaKeywords: [...settings.baaKeywords, keyword.trim()]
        });
      }
      setNewBaaKeyword("");
    }
  };

  const removeKeyword = (keyword: string, type: "search" | "baa") => {
    if (type === "search") {
      setSettings({
        ...settings,
        searchKeywords: settings.searchKeywords.filter(k => k !== keyword)
      });
    } else {
      setSettings({
        ...settings,
        baaKeywords: settings.baaKeywords.filter(k => k !== keyword)
      });
    }
  };

  const addNaicsCode = () => {
    if (!newNaicsCode.trim() || !newNaicsDesc.trim()) return;
    
    if (settings.naicsCodes.some(n => n.code === newNaicsCode.trim())) {
      toast.error("NAICS code already exists");
      return;
    }
    
    setSettings({
      ...settings,
      naicsCodes: [...settings.naicsCodes, { code: newNaicsCode.trim(), description: newNaicsDesc.trim() }]
    });
    setNewNaicsCode("");
    setNewNaicsDesc("");
  };

  const removeNaicsCode = (code: string) => {
    setSettings({
      ...settings,
      naicsCodes: settings.naicsCodes.filter(n => n.code !== code)
    });
  };

  const toggleArrayItem = (item: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal/settings">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">SAM.gov Search Configuration</h1>
          <p className="text-sm text-muted-foreground">Configure search scope and filters for university SAM.gov searches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enable/Disable */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Scope Status
            </CardTitle>
            <CardDescription>Enable or disable scoped SAM.gov search for universities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Checkbox
                id="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked as boolean })}
              />
              <Label htmlFor="enabled" className="text-base font-medium">
                Enable scoped SAM.gov search
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              When enabled, SAM.gov searches will be scoped to the configured filters below. When disabled, searches will use default parameters.
            </p>
          </CardContent>
        </Card>

        {/* Contract Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Contract Categories
            </CardTitle>
            <CardDescription>Select contract opportunity categories to target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {CONTRACT_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={settings.contractCategories.includes(category)}
                  onCheckedChange={() => toggleArrayItem(
                    category, 
                    settings.contractCategories, 
                    (arr) => setSettings({ ...settings, contractCategories: arr })
                  )}
                />
                <Label htmlFor={`cat-${category}`} className="text-sm">{category}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notice Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Notice Types
            </CardTitle>
            <CardDescription>Select SAM.gov notice types to include</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {NOTICE_TYPES.map((noticeType) => (
              <div key={noticeType} className="flex items-center gap-2">
                <Checkbox
                  id={`notice-${noticeType}`}
                  checked={settings.noticeTypes.includes(noticeType)}
                  onCheckedChange={() => toggleArrayItem(
                    noticeType, 
                    settings.noticeTypes, 
                    (arr) => setSettings({ ...settings, noticeTypes: arr })
                  )}
                />
                <Label htmlFor={`notice-${noticeType}`} className="text-sm">{noticeType}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NAICS Codes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              NAICS Codes
            </CardTitle>
            <CardDescription>Configure NAICS codes for university searches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.naicsCodes.map((naics) => (
                <div
                  key={naics.code}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="font-mono text-sm font-medium">{naics.code}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                  <span className="text-sm">{naics.description}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNaicsCode(naics.code)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="NAICS code (e.g., 611310)"
                value={newNaicsCode}
                onChange={(e) => setNewNaicsCode(e.target.value)}
                className="w-32"
              />
              <Input
                placeholder="Description"
                value={newNaicsDesc}
                onChange={(e) => setNewNaicsDesc(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addNaicsCode} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Set-Asides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Set-Asides
            </CardTitle>
            <CardDescription>Select set-aside programs to target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SET_ASIDES.map((setAside) => (
              <div key={setAside} className="flex items-center gap-2">
                <Checkbox
                  id={`setaside-${setAside}`}
                  checked={settings.setAsides.includes(setAside)}
                  onCheckedChange={() => toggleArrayItem(
                    setAside, 
                    settings.setAsides, 
                    (arr) => setSettings({ ...settings, setAsides: arr })
                  )}
                />
                <Label htmlFor={`setaside-${setAside}`} className="text-sm">{setAside}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Target Agencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Target Agencies
            </CardTitle>
            <CardDescription>Select federal agencies to target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {TARGET_AGENCIES.map((agency) => (
              <div key={agency} className="flex items-center gap-2">
                <Checkbox
                  id={`agency-${agency}`}
                  checked={settings.targetAgencies.includes(agency)}
                  onCheckedChange={() => toggleArrayItem(
                    agency, 
                    settings.targetAgencies, 
                    (arr) => setSettings({ ...settings, targetAgencies: arr })
                  )}
                />
                <Label htmlFor={`agency-${agency}`} className="text-sm">{agency}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Search Keywords */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Keywords
            </CardTitle>
            <CardDescription>Capability areas, research areas, faculty expertise, and industry partnerships</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.searchKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full"
                >
                  <span className="text-sm">{keyword}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(keyword, "search")}
                    className="h-5 w-5 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword (e.g., advanced manufacturing, AI curriculum)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword(newKeyword, "search")}
                className="flex-1"
              />
              <Button onClick={() => addKeyword(newKeyword, "search")} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Suggested keywords:</p>
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_KEYWORDS.filter(k => !settings.searchKeywords.includes(k)).slice(0, 5).map((keyword) => (
                  <Button
                    key={keyword}
                    variant="outline"
                    size="sm"
                    onClick={() => addKeyword(keyword, "search")}
                    className="text-xs"
                  >
                    + {keyword}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BAA Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Broad Agency Announcements (BAA)
            </CardTitle>
            <CardDescription>Configure BAA-specific search parameters for research-heavy opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Checkbox
                id="enableBAA"
                checked={settings.enableBAA}
                onCheckedChange={(checked) => setSettings({ ...settings, enableBAA: checked as boolean })}
              />
              <Label htmlFor="enableBAA" className="text-base font-medium">
                Enable BAA search mode
              </Label>
            </div>
            
            {settings.enableBAA && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div className="flex flex-wrap gap-2">
                  {settings.baaKeywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full"
                    >
                      <span className="text-sm">{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyword(keyword, "baa")}
                        className="h-5 w-5 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add BAA keyword (e.g., Quantum Computing, Biotechnology)"
                    value={newBaaKeyword}
                    onChange={(e) => setNewBaaKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addKeyword(newBaaKeyword, "baa")}
                    className="flex-1"
                  />
                  <Button onClick={() => addKeyword(newBaaKeyword, "baa")} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Suggested BAA keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {BAA_KEYWORDS.filter(k => !settings.baaKeywords.includes(k)).slice(0, 5).map((keyword) => (
                      <Button
                        key={keyword}
                        variant="outline"
                        size="sm"
                        onClick={() => addKeyword(keyword, "baa")}
                        className="text-xs"
                      >
                        + {keyword}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Place of Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Place of Performance
            </CardTitle>
            <CardDescription>Select states for place of performance filtering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {US_STATES.map((state) => (
                <div key={state} className="flex items-center gap-2">
                  <Checkbox
                    id={`state-${state}`}
                    checked={settings.popStates.includes(state)}
                    onCheckedChange={() => toggleArrayItem(
                      state, 
                      settings.popStates, 
                      (arr) => setSettings({ ...settings, popStates: arr })
                    )}
                  />
                  <Label htmlFor={`state-${state}`} className="text-sm">{state}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date Ranges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date Ranges
            </CardTitle>
            <CardDescription>Configure date filters for opportunity searches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responseDays">Response deadline (days from now)</Label>
              <Input
                id="responseDays"
                type="number"
                value={settings.responseDateDays}
                onChange={(e) => setSettings({ ...settings, responseDateDays: parseInt(e.target.value) || 30 })}
                min="1"
                max="365"
              />
              <p className="text-xs text-muted-foreground">Include opportunities with response deadlines within this many days</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postedDays">Posted date (days ago)</Label>
              <Input
                id="postedDays"
                type="number"
                value={settings.postedDateDays}
                onChange={(e) => setSettings({ ...settings, postedDateDays: parseInt(e.target.value) || 90 })}
                min="1"
                max="365"
              />
              <p className="text-xs text-muted-foreground">Include opportunities posted within this many days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/portal/admin/fedsignal/settings">
            Cancel
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
