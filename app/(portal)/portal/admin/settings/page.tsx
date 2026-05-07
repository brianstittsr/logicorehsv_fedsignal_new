"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bot, 
  Eye, 
  Key, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Shield,
  Users,
  Lock,
  Unlock
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("llm");

  // LLM Configuration State
  const [llmConfig, setLlmConfig] = useState({
    provider: "openai",
    apiKey: "",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "You are a helpful assistant for grant writing and research.",
  });

  // Visibility Configuration State
  const [visibilityConfig, setVisibilityConfig] = useState({
    fedsignal: true,
    grants: true,
    academy: true,
    events: true,
    marketing: true,
    team: true,
    analytics: true,
    settings: true,
  });

  // API Management State
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Firebase Admin", key: "••••••••••••••••", lastUsed: "2024-01-15", status: "active" },
    { id: 2, name: "OpenAI API", key: "••••••••••••••••", lastUsed: "2024-01-14", status: "active" },
  ]);
  const [newApiKey, setNewApiKey] = useState({ name: "", key: "" });

  // HBCU User Profiles State
  const [hbcuUsers, setHbcuUsers] = useState([
    { id: 1, name: "Tuskegee University", email: "admin@tuskegee.edu", role: "hbcu", visibility: ["fedsignal", "grants", "academy"] },
    { id: 2, name: "Howard University", email: "admin@howard.edu", role: "hbcu", visibility: ["fedsignal", "grants", "events"] },
    { id: 3, name: "Spelman College", email: "admin@spelman.edu", role: "hbcu", visibility: ["fedsignal", "academy", "team"] },
  ]);

  const handleLlmSave = () => {
    console.log("Saving LLM configuration:", llmConfig);
    // In a real app, this would save to Firebase
  };

  const handleVisibilitySave = () => {
    console.log("Saving visibility configuration:", visibilityConfig);
    // In a real app, this would save to Firebase
  };

  const handleAddApiKey = () => {
    if (newApiKey.name && newApiKey.key) {
      setApiKeys([
        ...apiKeys,
        {
          id: Date.now(),
          name: newApiKey.name,
          key: "••••••••••••••••",
          lastUsed: new Date().toISOString().split("T")[0],
          status: "active",
        },
      ]);
      setNewApiKey({ name: "", key: "" });
    }
  };

  const handleDeleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const toggleUserVisibility = (userId: number, feature: string) => {
    setHbcuUsers(
      hbcuUsers.map(user => {
        if (user.id === userId) {
          const newVisibility = user.visibility.includes(feature)
            ? user.visibility.filter(f => f !== feature)
            : [...user.visibility, feature];
          return { ...user, visibility: newVisibility };
        }
        return user;
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground">Configure system settings, permissions, and integrations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="llm" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            LLM Configuration
          </TabsTrigger>
          <TabsTrigger value="visibility" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visibility
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            HBCU Users
          </TabsTrigger>
        </TabsList>

        {/* LLM Configuration Tab */}
        <TabsContent value="llm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                LLM Configuration
              </CardTitle>
              <CardDescription>
                Configure the AI language model for grant writing assistance and other AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={llmConfig.provider} onValueChange={(value) => setLlmConfig({ ...llmConfig, provider: value })}>
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google AI</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={llmConfig.apiKey}
                    onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select value={llmConfig.model} onValueChange={(value) => setLlmConfig({ ...llmConfig, model: value })}>
                    <SelectTrigger id="model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temperature">Temperature: {llmConfig.temperature}</Label>
                    <Input
                      id="temperature"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={llmConfig.temperature}
                      onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={llmConfig.maxTokens}
                      onChange={(e) => setLlmConfig({ ...llmConfig, maxTokens: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={llmConfig.systemPrompt}
                    onChange={(e) => setLlmConfig({ ...llmConfig, systemPrompt: e.target.value })}
                    rows={4}
                    placeholder="Enter the system prompt for the AI assistant"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setLlmConfig({
                  provider: "openai",
                  apiKey: "",
                  model: "gpt-4",
                  temperature: 0.7,
                  maxTokens: 2000,
                  systemPrompt: "You are a helpful assistant for grant writing and research.",
                })}>
                  Reset
                </Button>
                <Button onClick={handleLlmSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visibility Tab */}
        <TabsContent value="visibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Sidebar Visibility Settings
              </CardTitle>
              <CardDescription>
                Control which navigation links are visible based on user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">FedSignal</h3>
                    <p className="text-sm text-muted-foreground">Federal grant tracking and management</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.fedsignal}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, fedsignal: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Grants</h3>
                    <p className="text-sm text-muted-foreground">Grant application and management</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.grants}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, grants: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Academy</h3>
                    <p className="text-sm text-muted-foreground">Training and educational resources</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.academy}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, academy: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Events</h3>
                    <p className="text-sm text-muted-foreground">Event management and scheduling</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.events}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, events: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Marketing Hub</h3>
                    <p className="text-sm text-muted-foreground">Marketing materials and campaigns</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.marketing}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, marketing: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Team</h3>
                    <p className="text-sm text-muted-foreground">Team member management</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.team}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, team: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">Data analytics and reporting</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.analytics}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, analytics: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-muted-foreground">System settings and configuration</p>
                  </div>
                  <Switch
                    checked={visibilityConfig.settings}
                    onCheckedChange={(checked) => setVisibilityConfig({ ...visibilityConfig, settings: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleVisibilitySave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Visibility Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Manage API keys for external services and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold">Add New API Key</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                      placeholder="e.g., OpenAI API"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyValue">API Key</Label>
                    <Input
                      id="keyValue"
                      type="password"
                      value={newApiKey.key}
                      onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                      placeholder="Enter API key"
                    />
                  </div>
                  <Button onClick={handleAddApiKey} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Existing API Keys</h3>
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{apiKey.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>Key: {apiKey.key}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                          {apiKey.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteApiKey(apiKey.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HBCU Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                HBCU User Management
              </CardTitle>
              <CardDescription>
                Manage HBCU user profiles and their feature access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hbcuUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {user.name}
                        <Badge variant="outline">{user.role}</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Feature Access</h4>
                    <div className="flex flex-wrap gap-2">
                      {["fedsignal", "grants", "academy", "events", "marketing", "team", "analytics", "settings"].map((feature) => (
                        <Button
                          key={feature}
                          variant={user.visibility.includes(feature) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleUserVisibility(user.id, feature)}
                          className="flex items-center gap-1"
                        >
                          {user.visibility.includes(feature) ? (
                            <Unlock className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                          {feature}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
