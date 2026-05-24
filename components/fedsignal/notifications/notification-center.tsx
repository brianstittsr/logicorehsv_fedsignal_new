"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  X,
  ChevronRight,
  Filter,
  Settings,
  Calendar,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useNotifications, Notification, NotificationCategory } from "./notification-context";
import { cn } from "@/lib/utils";

const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
  deadline: <Clock className="h-4 w-4" />,
  task: <CheckCircle2 className="h-4 w-4" />,
  milestone: <Calendar className="h-4 w-4" />,
  approval: <Users className="h-4 w-4" />,
  compliance: <AlertCircle className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
  opportunity: <FileText className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
};

const typeColors = {
  info: "bg-blue-50 border-blue-200 text-blue-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  critical: "bg-red-50 border-red-200 text-red-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  reminder: "bg-purple-50 border-purple-200 text-purple-700",
};

const typeIcons = {
  info: <Info className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  critical: <AlertCircle className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  reminder: <Clock className="h-4 w-4" />,
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead, dismissNotification } = useNotifications();

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        notification.read ? "bg-slate-50 border-slate-200" : typeColors[notification.type],
        !notification.read && "shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-lg shrink-0",
            notification.read ? "bg-slate-200 text-slate-600" : "bg-white/80"
          )}
        >
          {typeIcons[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={cn(
                  "font-medium text-sm",
                  notification.read ? "text-slate-700" : "text-slate-900"
                )}
              >
                {notification.title}
                {!notification.read && (
                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500" />
                )}
              </h4>
              <p
                className={cn(
                  "text-sm mt-1",
                  notification.read ? "text-slate-500" : "text-slate-700"
                )}
              >
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  {categoryIcons[notification.category]}
                  {notification.category}
                </span>
                <span>•</span>
                <span>{notification.timestamp.toLocaleString()}</span>
                {notification.metadata?.deadline && (
                  <>
                    <span>•</span>
                    <span className="text-red-600 font-medium">
                      Due: {new Date(notification.metadata.deadline).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {(notification.actionUrl || notification.dismissible) && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actionUrl && (
                <Button
                  size="sm"
                  variant={notification.read ? "outline" : "default"}
                  className="h-7 text-xs"
                  asChild
                >
                  <a href={notification.actionUrl}>
                    {notification.actionLabel || "View Details"}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              {!notification.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => markAsRead(notification.id)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Mark Read
                </Button>
              )}
              {notification.dismissible && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-red-600 hover:text-red-700"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    criticalCount,
    markAllAsRead,
    clearAll,
    getNotificationsByCategory,
    getNotificationsByType,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "critical":
        return getNotificationsByType("critical");
      case "deadlines":
        return getNotificationsByCategory("deadline");
      case "tasks":
        return getNotificationsByCategory("task");
      default:
        return notifications;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-xl">Notification Center</CardTitle>
              <p className="text-sm text-slate-500">
                Stay on track with your proposals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertCircle className="h-3 w-3 mr-1" />
                {criticalCount} Critical
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-4">
          <TabsList className="w-full justify-start rounded-none bg-transparent h-12">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-md"
            >
              All
              <Badge variant="secondary" className="ml-2 text-xs">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-md"
            >
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="critical"
              className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:shadow-none rounded-md"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Critical
              {criticalCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {criticalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="deadlines"
              className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none rounded-md"
            >
              <Clock className="h-3 w-3 mr-1" />
              Deadlines
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none rounded-md"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Tasks
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {filteredNotifications().length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No notifications</p>
                    <p className="text-sm text-slate-400">
                      You&apos;re all caught up! Check back later for updates.
                    </p>
                  </div>
                ) : (
                  filteredNotifications().map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
