"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type NotificationType = "info" | "warning" | "critical" | "success" | "reminder";
export type NotificationCategory = 
  | "deadline" 
  | "task" 
  | "milestone" 
  | "approval" 
  | "compliance" 
  | "team" 
  | "opportunity" 
  | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  dismissible: boolean;
  metadata?: {
    opportunityId?: string;
    phaseId?: string;
    taskId?: string;
    deadline?: Date;
    priority?: "low" | "medium" | "high" | "critical";
  };
}

export interface ReminderSchedule {
  id: string;
  title: string;
  description: string;
  triggerDate: Date;
  recurring: boolean;
  recurrencePattern?: "daily" | "weekly" | "biweekly" | "monthly";
  category: NotificationCategory;
  notificationType: NotificationType;
  actionUrl?: string;
  isActive: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  criticalCount: number;
  reminders: ReminderSchedule[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  addReminder: (reminder: Omit<ReminderSchedule, "id">) => void;
  removeReminder: (id: string) => void;
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUpcomingReminders: (days: number) => ReminderSchedule[];
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<ReminderSchedule[]>([]);

  // Calculate unread and critical counts
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => !n.read && (n.type === "critical" || n.metadata?.priority === "critical")
  ).length;

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Add reminder
  const addReminder = useCallback((reminder: Omit<ReminderSchedule, "id">) => {
    const newReminder: ReminderSchedule = {
      ...reminder,
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setReminders((prev) => [...prev, newReminder]);
  }, []);

  // Remove reminder
  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Getters
  const getNotificationsByCategory = useCallback(
    (category: NotificationCategory) => {
      return notifications.filter((n) => n.category === category);
    },
    [notifications]
  );

  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  const getUpcomingReminders = useCallback(
    (days: number) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + days);
      return reminders.filter(
        (r) => r.isActive && r.triggerDate <= cutoff && r.triggerDate >= new Date()
      );
    },
    [reminders]
  );

  // Auto-check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder) => {
        if (reminder.isActive && reminder.triggerDate <= now) {
          // Trigger notification
          addNotification({
            title: reminder.title,
            message: reminder.description,
            type: reminder.notificationType,
            category: reminder.category,
            dismissible: true,
            actionUrl: reminder.actionUrl,
            actionLabel: "View Details",
          });

          // If recurring, update next trigger date
          if (reminder.recurring && reminder.recurrencePattern) {
            const nextDate = new Date(reminder.triggerDate);
            switch (reminder.recurrencePattern) {
              case "daily":
                nextDate.setDate(nextDate.getDate() + 1);
                break;
              case "weekly":
                nextDate.setDate(nextDate.getDate() + 7);
                break;
              case "biweekly":
                nextDate.setDate(nextDate.getDate() + 14);
                break;
              case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            }
            setReminders((prev) =>
              prev.map((r) =>
                r.id === reminder.id ? { ...r, triggerDate: nextDate } : r
              )
            );
          } else {
            // Deactivate one-time reminders
            setReminders((prev) =>
              prev.map((r) => (r.id === reminder.id ? { ...r, isActive: false } : r))
            );
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately on mount

    return () => clearInterval(interval);
  }, [reminders, addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        criticalCount,
        reminders,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
        addReminder,
        removeReminder,
        getNotificationsByCategory,
        getNotificationsByType,
        getUpcomingReminders,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
