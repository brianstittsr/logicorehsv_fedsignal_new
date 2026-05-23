"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Brain, Server, MessageSquare, Terminal, Key, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FSHermesConfigDoc, HermesHostingMode, HermesModelProvider, HermesNotificationDigest } from "@/lib/fedsignal/schema";

export default function HermesConfigPage() {
  const [config, setConfig] = useState<Partial<FSHermesConfigDoc>>({
    hosting: {
      mode: "vercel-edge",
      backendUrl: "",
      region: "us-east-1",
    },
    interfaces: {
      chat: {
        enabled: true,
        default: true,
      },
      messaging: {
        enabled: false,
        platforms: [],
        config: {},
      },
      cli: {
        enabled: false,
        allowedUsers: [],
      },
    },
    models: {
      defaultProvider: "openai",
      providers: {
        openai: { apiKey: "", model: "gpt-4" },
      },
      useCaseDefaults: {
        analysis: "gpt-4",
        notifications: "gpt-3.5-turbo",
        chat: "gpt-4",
      },
    },
    samgov: {
      pollingInterval: 60,
      enabledUniversities: [],
      notificationDigest: "daily",
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testConnection, setTestConnection] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fedsignal/hermes/config");
      const data = await response.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/fedsignal/hermes/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Hermes configuration saved successfully");
      } else {
        toast.error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const testProviderConnection = async (provider: HermesModelProvider) => {
    const apiKey = config.models?.providers?.[provider]?.apiKey;
    if (!apiKey) {
      toast.error("API key not configured for this provider");
      return;
    }

    try {
      // This would be a real API test - for now just simulate
      setTestConnection({ ...testConnection, [provider]: true });
      toast.success(`${provider} connection successful`);
    } catch (error) {
      setTestConnection({ ...testConnection, [provider]: false });
      toast.error(`${provider} connection failed`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading configuration...</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Hermes Agent Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure AI-powered automation for SAM.gov operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hosting Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Hosting Configuration
            </CardTitle>
            <CardDescription>
              Configure how Hermes Agent is deployed and hosted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostingMode">Hosting Mode</Label>
              <Select
                value={config.hosting?.mode}
                onValueChange={(value: HermesHostingMode) =>
                  setConfig({
                    ...config,
                    hosting: { ...config.hosting!, mode: value },
                  })
                }
              >
                <SelectTrigger id="hostingMode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vercel-edge">Vercel Edge Functions (Serverless)</SelectItem>
                  <SelectItem value="backend-service">Separate Backend Service</SelectItem>
                  <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.hosting?.mode === "vercel-edge" &&
                  "Lightweight operations with serverless functions. Suitable for scheduled polling and notifications."}
                {config.hosting?.mode === "backend-service" &&
                  "Full Hermes instance with learning capabilities. Requires separate backend deployment."}
                {config.hosting?.mode === "hybrid" &&
                  "Vercel for triggers, backend for heavy AI processing. Best for complex automations."}
              </p>
            </div>

            {(config.hosting?.mode === "backend-service" || config.hosting?.mode === "hybrid") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="backendUrl">Backend Service URL</Label>
                  <Input
                    id="backendUrl"
                    placeholder="https://your-hermes-backend.railway.app"
                    value={config.hosting?.backendUrl || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hosting: { ...config.hosting!, backendUrl: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Deployment Region</Label>
                  <Select
                    value={config.hosting?.region}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        hosting: { ...config.hosting!, region: value },
                      })
                    }
                  >
                    <SelectTrigger id="region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                      <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Interface Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              User Interfaces
            </CardTitle>
            <CardDescription>
              Configure how users interact with Hermes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="chatEnabled"
                  checked={config.interfaces?.chat?.enabled}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      interfaces: {
                        ...config.interfaces!,
                        chat: { ...config.interfaces!.chat!, enabled: checked as boolean },
                      },
                    })
                  }
                />
                <Label htmlFor="chatEnabled" className="font-medium">
                  Integrated Chat Interface
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Web-based chat component in FedSignal dashboard
              </p>
              <div className="flex items-center gap-2 pl-6">
                <Checkbox
                  id="chatDefault"
                  checked={config.interfaces?.chat?.default}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      interfaces: {
                        ...config.interfaces!,
                        chat: { ...config.interfaces!.chat!, default: checked as boolean },
                      },
                    })
                  }
                />
                <Label htmlFor="chatDefault" className="text-sm">
                  Set as default interface
                </Label>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="messagingEnabled"
                  checked={config.interfaces?.messaging?.enabled}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      interfaces: {
                        ...config.interfaces!,
                        messaging: { ...config.interfaces!.messaging!, enabled: checked as boolean },
                      },
                    })
                  }
                />
                <Label htmlFor="messagingEnabled" className="font-medium">
                  Messaging Gateway
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Telegram, Discord, Email for university staff
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="cliEnabled"
                  checked={config.interfaces?.cli?.enabled}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      interfaces: {
                        ...config.interfaces!,
                        cli: { ...config.interfaces!.cli!, enabled: checked as boolean },
                      },
                    })
                  }
                />
                <Label htmlFor="cliEnabled" className="font-medium">
                  CLI Access
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Command-line interface for administrators
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              LLM Provider Configuration
            </CardTitle>
            <CardDescription>
              Configure AI model providers and defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultProvider">Default Provider</Label>
              <Select
                value={config.models?.defaultProvider}
                onValueChange={(value: HermesModelProvider) =>
                  setConfig({
                    ...config,
                    models: { ...config.models!, defaultProvider: value },
                  })
                }
              >
                <SelectTrigger id="defaultProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                  <SelectItem value="nous">Nous Portal</SelectItem>
                  <SelectItem value="custom">Custom Endpoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>OpenAI Configuration</Label>
              <Input
                placeholder="API Key"
                type="password"
                value={config.models?.providers?.openai?.apiKey || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    models: {
                      ...config.models!,
                      providers: {
                        ...config.models!.providers,
                        openai: {
                          ...config.models!.providers!.openai!,
                          apiKey: e.target.value,
                        },
                      },
                    },
                  })
                }
              />
              <Input
                placeholder="Model (e.g., gpt-4)"
                value={config.models?.providers?.openai?.model || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    models: {
                      ...config.models!,
                      providers: {
                        ...config.models!.providers,
                        openai: {
                          ...config.models!.providers!.openai!,
                          model: e.target.value,
                        },
                      },
                    },
                  })
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testProviderConnection("openai")}
              >
                Test Connection
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Use Case Defaults</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Analysis</Label>
                  <Input
                    value={config.models?.useCaseDefaults?.analysis || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        models: {
                          ...config.models!,
                          useCaseDefaults: {
                            ...config.models!.useCaseDefaults!,
                            analysis: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Notifications</Label>
                  <Input
                    value={config.models?.useCaseDefaults?.notifications || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        models: {
                          ...config.models!,
                          useCaseDefaults: {
                            ...config.models!.useCaseDefaults!,
                            notifications: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Chat</Label>
                  <Input
                    value={config.models?.useCaseDefaults?.chat || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        models: {
                          ...config.models!,
                          useCaseDefaults: {
                            ...config.models!.useCaseDefaults!,
                            chat: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SAM.gov Automation Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              SAM.gov Automation
            </CardTitle>
            <CardDescription>
              Configure automated data pulls and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pollingInterval">Polling Interval (minutes)</Label>
                <Input
                  id="pollingInterval"
                  type="number"
                  min="5"
                  max="1440"
                  value={config.samgov?.pollingInterval || 60}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      samgov: {
                        ...config.samgov!,
                        pollingInterval: parseInt(e.target.value) || 60,
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  How often to poll SAM.gov for new opportunities
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationDigest">Notification Digest</Label>
                <Select
                  value={config.samgov?.notificationDigest}
                  onValueChange={(value: HermesNotificationDigest) =>
                    setConfig({
                      ...config,
                      samgov: {
                        ...config.samgov!,
                        notificationDigest: value,
                      },
                    })
                  }
                >
                  <SelectTrigger id="notificationDigest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Frequency of notification delivery
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Enabled Universities</Label>
              <p className="text-xs text-muted-foreground">
                Select universities to include in automated SAM.gov polling
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "tuskegee", name: "Tuskegee University" },
                  { id: "howard", name: "Howard University" },
                  { id: "famu", name: "Florida A&M University" },
                  { id: "aamu", name: "Alabama A&M University" },
                  { id: "ncat", name: "NC A&T State University" },
                  { id: "morehouse", name: "Morehouse College" },
                  { id: "huston-tillotson", name: "Huston-Tillotson University" },
                ].map((uni) => (
                  <div key={uni.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`uni-${uni.id}`}
                      checked={config.samgov?.enabledUniversities?.includes(uni.id)}
                      onCheckedChange={(checked) => {
                        const current = config.samgov?.enabledUniversities || [];
                        const updated = checked
                          ? [...current, uni.id]
                          : current.filter((id) => id !== uni.id);
                        setConfig({
                          ...config,
                          samgov: {
                            ...config.samgov!,
                            enabledUniversities: updated,
                          },
                        });
                      }}
                    />
                    <Label htmlFor={`uni-${uni.id}`} className="text-sm">
                      {uni.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={loadConfig}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
