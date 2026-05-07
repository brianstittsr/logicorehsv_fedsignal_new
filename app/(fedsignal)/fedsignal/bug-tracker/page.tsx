"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bug, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  Edit2,
  Trash2,
  MoreVertical
} from "lucide-react";

// Bug status types
type BugStatus = "open" | "in_progress" | "resolved" | "closed";
type BugPriority = "low" | "medium" | "high" | "critical";
type BugSeverity = "cosmetic" | "minor" | "major" | "critical";
type BugCategory = "ui" | "functionality" | "performance" | "security" | "data" | "other";

interface Bug {
  id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  severity: BugSeverity;
  category: BugCategory;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

// Mock data - in production, this would come from a database
const mockBugs: Bug[] = [
  {
    id: "BUG-001",
    title: "Grant application form not saving draft",
    description: "When clicking 'Save Draft' on the grant application form, the data is not persisting to localStorage. Users lose their work when refreshing the page.",
    status: "open",
    priority: "high",
    severity: "major",
    category: "functionality",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    createdBy: "john.doe@tuskegee.edu",
    assignedTo: "dev-team@logiccore.com",
    comments: [
      {
        id: "C001",
        author: "john.doe@tuskegee.edu",
        content: "This is blocking our grant submission process. Need immediate attention.",
        createdAt: "2025-01-15",
      },
    ],
  },
  {
    id: "BUG-002",
    title: "Dashboard charts not loading on mobile",
    description: "The dashboard charts fail to render on mobile devices (iOS Safari and Android Chrome). Works fine on desktop.",
    status: "in_progress",
    priority: "medium",
    severity: "minor",
    category: "ui",
    createdAt: "2025-01-14",
    updatedAt: "2025-01-16",
    createdBy: "sarah.smith@tuskegee.edu",
    assignedTo: "frontend@logiccore.com",
    comments: [],
  },
  {
    id: "BUG-003",
    title: "Slow query performance on grant tracker",
    description: "Loading the grant tracker page takes 15+ seconds when there are more than 100 grants in the system.",
    status: "open",
    priority: "high",
    severity: "major",
    category: "performance",
    createdAt: "2025-01-13",
    updatedAt: "2025-01-13",
    createdBy: "admin@tuskegee.edu",
    comments: [],
  },
  {
    id: "BUG-004",
    title: "Security vulnerability in file upload",
    description: "File upload endpoint does not validate file types properly. Potential for malicious file upload.",
    status: "resolved",
    priority: "critical",
    severity: "critical",
    category: "security",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-12",
    createdBy: "security@logiccore.com",
    assignedTo: "security@logiccore.com",
    comments: [
      {
        id: "C002",
        author: "security@logiccore.com",
        content: "Fixed by adding proper file validation on both client and server side.",
        createdAt: "2025-01-12",
      },
    ],
  },
];

export default function BugTrackerPage() {
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  
  // New bug form state
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    priority: "medium" as BugPriority,
    severity: "minor" as BugSeverity,
    category: "functionality" as BugCategory,
  });

  // Comment form state
  const [newComment, setNewComment] = useState("");

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || bug.status === filterStatus;
    const matchesPriority = filterPriority === "all" || bug.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateBug = () => {
    const bug: Bug = {
      id: `BUG-${String(bugs.length + 1).padStart(3, "0")}`,
      title: newBug.title,
      description: newBug.description,
      status: "open",
      priority: newBug.priority,
      severity: newBug.severity,
      category: newBug.category,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "current-user@tuskegee.edu",
      comments: [],
    };
    setBugs([bug, ...bugs]);
    setNewBug({ title: "", description: "", priority: "medium", severity: "minor", category: "functionality" });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateStatus = (bugId: string, newStatus: BugStatus) => {
    setBugs(bugs.map((bug) => 
      bug.id === bugId 
        ? { ...bug, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }
        : bug
    ));
    if (selectedBug && selectedBug.id === bugId) {
      setSelectedBug({
        ...selectedBug,
        status: newStatus,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleAddComment = () => {
    if (!selectedBug || !newComment.trim()) return;
    
    const comment: Comment = {
      id: `C${String(Date.now())}`,
      author: "current-user@tuskegee.edu",
      content: newComment,
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    const updatedBug = {
      ...selectedBug,
      comments: [...selectedBug.comments, comment],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    
    setBugs(bugs.map((bug) => 
      bug.id === selectedBug.id ? updatedBug : bug
    ));
    setSelectedBug(updatedBug);
    setNewComment("");
  };

  const getStatusIcon = (status: BugStatus) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: BugPriority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getSeverityIcon = (severity: BugSeverity) => {
    switch (severity) {
      case "cosmetic":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case "minor":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "major":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const stats = {
    total: bugs.length,
    open: bugs.filter((b) => b.status === "open").length,
    inProgress: bugs.filter((b) => b.status === "in_progress").length,
    resolved: bugs.filter((b) => b.status === "resolved").length,
    critical: bugs.filter((b) => b.priority === "critical").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bug className="h-8 w-8 text-[#1a56db]" />
            Bug Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage application issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Bugs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-500">{stats.open}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1a56db]">
                    <Plus className="h-4 w-4 mr-2" />
                    New Bug
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Report New Bug</DialogTitle>
                    <DialogDescription>
                      Provide details about the issue you've encountered
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newBug.title}
                        onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                        placeholder="Brief description of the issue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newBug.description}
                        onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                        placeholder="Detailed description of the bug, including steps to reproduce"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newBug.priority} onValueChange={(value: BugPriority) => setNewBug({ ...newBug, priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <Select value={newBug.severity} onValueChange={(value: BugSeverity) => setNewBug({ ...newBug, severity: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cosmetic">Cosmetic</SelectItem>
                            <SelectItem value="minor">Minor</SelectItem>
                            <SelectItem value="major">Major</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newBug.category} onValueChange={(value: BugCategory) => setNewBug({ ...newBug, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ui">UI</SelectItem>
                            <SelectItem value="functionality">Functionality</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="data">Data</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBug} disabled={!newBug.title || !newBug.description} className="bg-[#1a56db]">
                      Submit Bug Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Bug List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBugs.map((bug) => (
            <Card 
              key={bug.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedBug(bug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={getPriorityColor(bug.priority)}>{bug.priority}</Badge>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(bug.status)}
                    <span className="text-xs text-muted-foreground capitalize">{bug.status.replace("_", " ")}</span>
                  </div>
                </div>
                <CardTitle className="text-base mt-2">{bug.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bug.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{bug.id}</span>
                  <span>•</span>
                  <span>{bug.category}</span>
                  <span>•</span>
                  <span>{bug.createdAt}</span>
                </div>
                {bug.comments.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{bug.comments.length} comments</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBugs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bug className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bugs found matching your criteria</p>
          </div>
        )}

        {/* Bug Detail Dialog */}
        {selectedBug && (
          <Dialog open={!!selectedBug} onOpenChange={() => setSelectedBug(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-2">{selectedBug.title}</DialogTitle>
                    <DialogDescription>
                      #{selectedBug.id} • Created {selectedBug.createdAt} • Last updated {selectedBug.updatedAt}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={selectedBug.status} 
                      onValueChange={(value: BugStatus) => handleUpdateStatus(selectedBug.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({selectedBug.comments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Priority</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className={getPriorityColor(selectedBug.priority)}>{selectedBug.priority}</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Severity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(selectedBug.severity)}
                          <span className="capitalize">{selectedBug.severity}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="capitalize">{selectedBug.category}</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedBug.status)}
                          <span className="capitalize">{selectedBug.status.replace("_", " ")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedBug.description}</p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Created By</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedBug.createdBy}</p>
                      </CardContent>
                    </Card>
                    {selectedBug.assignedTo && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Assigned To</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedBug.assignedTo}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {selectedBug.comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                    ) : (
                      selectedBug.comments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} className="bg-[#1a56db]">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setSelectedBug(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
