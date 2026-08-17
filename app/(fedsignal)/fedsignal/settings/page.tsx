"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  MessageSquare,
  Zap,
  Brain,
  Server,
  Webhook,
  Key,
  RefreshCw,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Instagram,
  Globe,
  Building2,
  FileText,
  Database,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/schema";
import { clearSamGovConfigCache } from "@/lib/sam/samApiClient";

interface ApiKeyConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  keyField: string;
  webhookField?: string;
  additionalFields?: { name: string; label: string; placeholder: string }[];
  status: "connected" | "disconnected" | "error";
  lastTested?: string;
}

const apiConfigs: ApiKeyConfig[] = [
  {
    id: "sam-gov",
    name: "SAM.gov",
    description: "System for Award Management - official federal procurement system",
    icon: Building2,
    keyField: "API Key",
    additionalFields: [
      { name: "serverUrl", label: "Server URL", placeholder: "https://c-gray-samgovapiserver.vercel.app" },
    ],
    status: "disconnected",
  },
  {
    id: "grants-gov",
    name: "Grants.gov",
    description: "Federal grant opportunities and application management",
    icon: FileText,
    keyField: "API Key",
    additionalFields: [
      { name: "trackingId", label: "Tracking ID", placeholder: "tracking-id" },
    ],
    status: "disconnected",
  },
  {
    id: "nsf",
    name: "NSF",
    description: "National Science Foundation research funding",
    icon: Database,
    keyField: "API Key",
    additionalFields: [
      { name: "institutionId", label: "Institution ID", placeholder: "institution-id" },
    ],
    status: "disconnected",
  },
  {
    id: "nih",
    name: "NIH",
    description: "National Institutes of Health grant management",
    icon: FileText,
    keyField: "API Key",
    additionalFields: [
      { name: "projectReporterId", label: "Project Reporter ID", placeholder: "reporter-id" },
    ],
    status: "disconnected",
  },
];

const llmProviders = [
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { id: "anthropic", name: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"] },
  { id: "google", name: "Google AI", models: ["gemini-pro", "gemini-ultra"] },
  { id: "mistral", name: "Mistral AI", models: ["mistral-large", "mistral-medium", "mistral-small"] },
  { id: "ollama", name: "Ollama (Local)", models: ["llama2", "codellama", "mistral", "mixtral"] },
];

const SETTINGS_DOC_ID = "fedsignal-settings";

export default function FedSignalSettingsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "integrations";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, Record<string, string>>>({
    "sam-gov": {
      apiKey: "SAM_API_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      serverUrl: "https://c-gray-samgovapiserver.vercel.app",
    },
    "grants-gov": {
      apiKey: "GRANTS_API_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      trackingId: "TRACK-123456",
    },
    "nsf": {
      apiKey: "NSF_API_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      institutionId: "INST-789012",
    },
    "nih": {
      apiKey: "NIH_API_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      projectReporterId: "PR-345678",
    },
  });
  const [testingStatus, setTestingStatus] = useState<Record<string, "testing" | "success" | "error" | null>>({
    "sam-gov": "success",
    "grants-gov": "success",
    "nsf": "success",
    "nih": null,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [llmConfig, setLlmConfig] = useState({
    provider: "openai",
    model: "gpt-4o",
    apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ollamaUrl: "http://localhost:11434",
    useOllama: false,
  });
  const [availableOllamaModels, setAvailableOllamaModels] = useState<string[]>([]);
  const [isLoadingOllamaModels, setIsLoadingOllamaModels] = useState(false);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "FedSignal",
    currentFiscalYear: "FY2025",
    currentQuarter: "Q2",
    defaultUniversityId: "huston-tillotson",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    grantAlertsEnabled: true,
    deadlineReminders: true,
    newOpportunities: true,
    partnershipInquiries: true,
    inAppEnabled: true,
    browserEnabled: false,
    soundEnabled: false,
  });

  // Social links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: { url: "https://linkedin.com/company/huston-tillotson-university", visible: true },
    twitter: { url: "https://twitter.com/HustonTillotson", visible: true },
    youtube: { url: "https://youtube.com/@HustonTillotson", visible: true },
    facebook: { url: "https://facebook.com/HustonTillotson", visible: true },
    instagram: { url: "https://instagram.com/hustontillotson", visible: true },
  });

  // Feature flags
  const [featureFlags, setFeatureFlags] = useState({
    enableProposalPal: true,
    enableRfiCreator: true,
    enableContentStudio: true,
    enableConsortiumWorkspace: true,
    enableSbriMatch: false,
    enableBoardReport: true,
    enablePartnershipMarketplace: true,
  });

  // Load settings from Firebase on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!db) {
        console.error("Firebase not initialized");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, COLLECTIONS.PLATFORM_SETTINGS, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as any;

          // Load integrations
          if (data.integrations) {
            const loadedApiKeys: Record<string, Record<string, string>> = {};
            if (data.integrations.samGov) {
              loadedApiKeys["sam-gov"] = {
                apiKey: data.integrations.samGov.apiKey || "",
                serverUrl: data.integrations.samGov.serverUrl || "https://c-gray-samgovapiserver.vercel.app",
              };
            }
            if (data.integrations.grantsGov) {
              loadedApiKeys["grants-gov"] = {
                apiKey: data.integrations.grantsGov.apiKey || "",
                trackingId: data.integrations.grantsGov.trackingId || "",
              };
            }
            if (data.integrations.nsf) {
              loadedApiKeys.nsf = {
                apiKey: data.integrations.nsf.apiKey || "",
                institutionId: data.integrations.nsf.institutionId || "",
              };
            }
            if (data.integrations.nih) {
              loadedApiKeys.nih = {
                apiKey: data.integrations.nih.apiKey || "",
                projectReporterId: data.integrations.nih.projectReporterId || "",
              };
            }
            setApiKeys(loadedApiKeys);
          }

          // Load LLM config
          if (data.llmConfig) {
            setLlmConfig({
              provider: data.llmConfig.provider || "openai",
              model: data.llmConfig.model || "gpt-4o",
              apiKey: data.llmConfig.apiKey || "",
              ollamaUrl: data.llmConfig.ollamaUrl || "http://localhost:11434",
              useOllama: data.llmConfig.useOllama || false,
            });
          }

          // Load general settings
          if (data.generalSettings) {
            setGeneralSettings(prev => ({ ...prev, ...data.generalSettings }));
          }

          // Load notification settings
          if (data.notificationSettings) {
            setNotificationSettings(prev => ({ ...prev, ...data.notificationSettings }));
          }

          // Load social links
          if (data.socialLinks) {
            setSocialLinks(prev => ({ ...prev, ...data.socialLinks }));
          }

          // Load feature flags
          if (data.featureFlags) {
            setFeatureFlags(prev => ({ ...prev, ...data.featureFlags }));
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Fetch available Ollama models when Ollama is enabled or URL changes
  useEffect(() => {
    async function fetchOllamaModels() {
      if (!llmConfig.useOllama || !llmConfig.ollamaUrl) return;

      setIsLoadingOllamaModels(true);
      try {
        const response = await fetch(`${llmConfig.ollamaUrl}/api/tags`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const models = data.models?.map((m: { name: string }) => m.name) || [];
        setAvailableOllamaModels(models);

        if (models.length > 0 && !models.includes(llmConfig.model)) {
          setLlmConfig(prev => ({ ...prev, model: models[0] }));
        }
      } catch (error) {
        console.error("Failed to fetch Ollama models:", error);
        setAvailableOllamaModels([]);
      } finally {
        setIsLoadingOllamaModels(false);
      }
    }

    fetchOllamaModels();
  }, [llmConfig.useOllama, llmConfig.ollamaUrl]);

  const saveSettings = async () => {
    if (!db) {
      alert("Firebase not initialized. Check your environment variables.");
      return;
    }
    setSaving(true);
    try {
      const docRef = doc(db, COLLECTIONS.PLATFORM_SETTINGS, SETTINGS_DOC_ID);

      const settingsData = {
        id: SETTINGS_DOC_ID,
        integrations: {
          samGov: {
            apiKey: apiKeys["sam-gov"]?.apiKey || "",
            serverUrl: apiKeys["sam-gov"]?.serverUrl || "https://c-gray-samgovapiserver.vercel.app",
            status: testingStatus["sam-gov"] === "success" ? "connected" : "disconnected",
          },
          grantsGov: {
            apiKey: apiKeys["grants-gov"]?.apiKey || "",
            trackingId: apiKeys["grants-gov"]?.trackingId || "",
            status: testingStatus["grants-gov"] === "success" ? "connected" : "disconnected",
          },
          nsf: {
            apiKey: apiKeys.nsf?.apiKey || "",
            institutionId: apiKeys.nsf?.institutionId || "",
            status: testingStatus.nsf === "success" ? "connected" : "disconnected",
          },
          nih: {
            apiKey: apiKeys.nih?.apiKey || "",
            projectReporterId: apiKeys.nih?.projectReporterId || "",
            status: testingStatus.nih === "success" ? "connected" : "disconnected",
          },
        },
        llmConfig: {
          provider: llmConfig.provider,
          model: llmConfig.model,
          apiKey: llmConfig.apiKey || "",
          ollamaUrl: llmConfig.ollamaUrl,
          useOllama: llmConfig.useOllama,
        },
        generalSettings: generalSettings,
        notificationSettings: notificationSettings,
        socialLinks: socialLinks,
        featureFlags: featureFlags,
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, settingsData, { merge: true });
      // Clear proxy config cache so new settings take effect immediately
      clearSamGovConfigCache();
      setHasChanges(false);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateApiKey = (configId: string, field: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [configId]: { ...prev[configId], [field]: value },
    }));
    setHasChanges(true);
  };

  const testConnection = async (configId: string) => {
    setTestingStatus(prev => ({ ...prev, [configId]: "testing" }));

    if (configId === "sam-gov") {
      try {
        const apiKey = apiKeys["sam-gov"]?.apiKey || "";
        const serverUrl = apiKeys["sam-gov"]?.serverUrl || "https://c-gray-samgovapiserver.vercel.app";
        
        if (!apiKey) {
          setTestingStatus(prev => ({ ...prev, [configId]: "error" }));
          return;
        }

        const response = await fetch("/api/sam/test-connection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, serverUrl }),
        });

        const result = await response.json();
        setTestingStatus(prev => ({ ...prev, [configId]: result.success ? "success" : "error" }));
      } catch (error) {
        console.error("SAM.gov test connection failed:", error);
        setTestingStatus(prev => ({ ...prev, [configId]: "error" }));
      }
    } else {
      // Simulate API test for other integrations
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestingStatus(prev => ({
        ...prev,
        [configId]: Math.random() > 0.3 ? "success" : "error"
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage API keys, integrations, and platform configuration
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saving ? "Saving..." : hasChanges ? "Save Changes" : "Save All Settings"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="llm">LLM Configuration</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6">
            {apiConfigs.map((config) => (
              <Card key={config.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <config.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {config.name}
                          <Badge
                            variant={
                              testingStatus[config.id] === "success"
                                ? "default"
                                : testingStatus[config.id] === "error"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {testingStatus[config.id] === "success"
                              ? "Connected"
                              : testingStatus[config.id] === "error"
                              ? "Error"
                              : "Not Connected"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(config.id)}
                      disabled={testingStatus[config.id] === "testing"}
                    >
                      {testingStatus[config.id] === "testing" ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="mr-2 h-4 w-4" />
                      )}
                      Test Connection
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${config.id}-key`}>{config.keyField}</Label>
                      <div className="relative">
                        <Input
                          id={`${config.id}-key`}
                          type={showKeys[config.id] ? "text" : "password"}
                          placeholder={`Enter your ${config.keyField.toLowerCase()}`}
                          value={apiKeys[config.id]?.apiKey || ""}
                          onChange={(e) => updateApiKey(config.id, "apiKey", e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleShowKey(config.id)}
                        >
                          {showKeys[config.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {config.additionalFields?.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={`${config.id}-${field.name}`}>{field.label}</Label>
                        <Input
                          id={`${config.id}-${field.name}`}
                          placeholder={field.placeholder}
                          value={apiKeys[config.id]?.[field.name] || ""}
                          onChange={(e) => updateApiKey(config.id, field.name, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LLM Configuration Tab */}
        <TabsContent value="llm" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>LLM Provider Configuration</CardTitle>
                  <CardDescription>
                    Configure your preferred Large Language Model provider for AI-powered features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Use Ollama (Local LLM)</Label>
                    <p className="text-sm text-muted-foreground">
                      Run models locally without API costs
                    </p>
                  </div>
                </div>
                <Switch
                  checked={llmConfig.useOllama}
                  onCheckedChange={(checked) =>
                    setLlmConfig({ ...llmConfig, useOllama: checked, provider: checked ? "ollama" : "openai" })
                  }
                />
              </div>

              {llmConfig.useOllama ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ollamaUrl">Ollama Server URL</Label>
                    <Input
                      id="ollamaUrl"
                      placeholder="http://localhost:11434"
                      value={llmConfig.ollamaUrl}
                      onChange={(e) => setLlmConfig({ ...llmConfig, ollamaUrl: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Default: http://localhost:11434
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ollamaModel">Model</Label>
                    <Select
                      value={llmConfig.model}
                      onValueChange={(value) => setLlmConfig({ ...llmConfig, model: value })}
                      disabled={isLoadingOllamaModels || availableOllamaModels.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingOllamaModels ? "Loading models..." : "Select a model"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOllamaModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableOllamaModels.length === 0 && !isLoadingOllamaModels && (
                      <p className="text-sm text-muted-foreground text-amber-600">
                        No models found. Ensure Ollama is running at {llmConfig.ollamaUrl}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      value={llmConfig.provider}
                      onValueChange={(value) => setLlmConfig({ ...llmConfig, provider: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {llmProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select
                      value={llmConfig.model}
                      onValueChange={(value) => setLlmConfig({ ...llmConfig, model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {llmProviders.find((p) => p.id === llmConfig.provider)?.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showKeys.llm ? "text" : "password"}
                        placeholder="Enter your API key"
                        value={llmConfig.apiKey}
                        onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleShowKey("llm")}
                      >
                        {showKeys.llm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Core platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={generalSettings.platformName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fy">Fiscal Year</Label>
                  <Input
                    id="fy"
                    value={generalSettings.currentFiscalYear}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currentFiscalYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q">Quarter</Label>
                  <Input
                    id="q"
                    value={generalSettings.currentQuarter}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currentQuarter: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultUni">Default University</Label>
                <Select
                  value={generalSettings.defaultUniversityId}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultUniversityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuskegee">Tuskegee University</SelectItem>
                    <SelectItem value="howard">Howard University</SelectItem>
                    <SelectItem value="famu">Florida A&M University</SelectItem>
                    <SelectItem value="aamu">Alabama A&M University</SelectItem>
                    <SelectItem value="ncat">NC A&T State University</SelectItem>
                    <SelectItem value="morehouse">Morehouse College</SelectItem>
                    <SelectItem value="huston-tillotson">Huston-Tillotson University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive grant alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Grant Alerts</h3>
                {[
                  { key: "grantAlertsEnabled", label: "Grant Alert Notifications", desc: "Receive notifications for new grant opportunities" },
                  { key: "deadlineReminders", label: "Deadline Reminders", desc: "Get reminders before grant deadlines" },
                  { key: "newOpportunities", label: "New Opportunities", desc: "Notify when new opportunities match your criteria" },
                  { key: "partnershipInquiries", label: "Partnership Inquiries", desc: "Receive notifications for partnership requests" },
                ].map((alert) => (
                  <div key={alert.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{alert.label}</div>
                      <div className="text-sm text-muted-foreground">{alert.desc}</div>
                    </div>
                    <Switch
                      checked={notificationSettings[alert.key as keyof typeof notificationSettings] as boolean}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, [alert.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Notification Channels</h3>
                {[
                  { key: "inAppEnabled", label: "In-App Notifications", icon: Bell },
                  { key: "browserEnabled", label: "Browser Notifications", icon: BellRing },
                  { key: "soundEnabled", label: "Sound Alerts", icon: Volume2 },
                ].map((channel) => (
                  <div key={channel.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <channel.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{channel.label}</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings[channel.key as keyof typeof notificationSettings] as boolean}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, [channel.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Manage your organization's social media presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "linkedin", label: "LinkedIn", icon: Linkedin },
                { key: "twitter", label: "Twitter", icon: Twitter },
                { key: "youtube", label: "YouTube", icon: Youtube },
                { key: "facebook", label: "Facebook", icon: Facebook },
                { key: "instagram", label: "Instagram", icon: Instagram },
              ].map((social) => (
                <div key={social.key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <social.icon className="h-5 w-5" />
                    <Label htmlFor={social.key}>{social.label}</Label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${social.key}-url`} className="text-sm">Profile URL</Label>
                      <Input
                        id={`${social.key}-url`}
                        placeholder={`https://${social.key}.com/your-handle`}
                        value={socialLinks[social.key as keyof typeof socialLinks].url}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            [social.key]: { ...socialLinks[social.key as keyof typeof socialLinks], url: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${social.key}-visible`} className="text-sm">Visibility</Label>
                      <div className="flex items-center gap-2 p-2 border rounded-lg">
                        <Switch
                          checked={socialLinks[social.key as keyof typeof socialLinks].visible}
                          onCheckedChange={(checked) =>
                            setSocialLinks({
                              ...socialLinks,
                              [social.key]: { ...socialLinks[social.key as keyof typeof socialLinks], visible: checked },
                            })
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {socialLinks[social.key as keyof typeof socialLinks].visible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable FedSignal platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "enableProposalPal", label: "Proposal Pal (AI)", desc: "AI-powered proposal writing assistant" },
                  { key: "enableRfiCreator", label: "RFI Creator (AI)", desc: "Automated RFI response generator" },
                  { key: "enableContentStudio", label: "Content Studio (AI)", desc: "Content creation and publishing" },
                  { key: "enableConsortiumWorkspace", label: "Consortium Workspace", desc: "Multi-university collaboration" },
                  { key: "enableSbriMatch", label: "SBIR/STTR Match", desc: "Small business research matching" },
                  { key: "enableBoardReport", label: "Board Report", desc: "Executive dashboard with AI insights" },
                  { key: "enablePartnershipMarketplace", label: "Partnership Marketplace", desc: "Find and manage research partnerships" },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-start gap-3 p-4 rounded-lg border">
                    <Switch
                      checked={featureFlags[feature.key as keyof typeof featureFlags] as boolean}
                      onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, [feature.key]: checked })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{feature.label}</div>
                      <div className="text-sm text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
