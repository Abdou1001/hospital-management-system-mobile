import { create } from "zustand";
import { AppNotification, NotificationFilter } from "@/types/notifications.type";

interface NotificationState {
    notifications: AppNotification[];
    filter: NotificationFilter;
    unreadCount: number;
    setFilter: (filter: NotificationFilter) => void;
    setNotifications: (notifications: AppNotification[]) => void;
    setUnreadCount: (count: number) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAllNotifications: () => void;
    addNotification: (notification: AppNotification) => void;
    getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    filter: "all",
    unreadCount: 0,

    setFilter: (filter) => set({ filter }),

    setNotifications: (notifications) => {
        const unreadCount = notifications.filter((item) => !item.is_read).length;
        set({ notifications, unreadCount });
    },

    setUnreadCount: (count) => set({ unreadCount: count }),

    markAsRead: (id) =>
        set((state) => {
            const updated = state.notifications.map((item) =>
                item.id === id ? { ...item, is_read: true } : item
            );
            return {
                notifications: updated,
                unreadCount: updated.filter((item) => !item.is_read).length,
            };
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((item) => ({
                ...item,
                is_read: true,
            })),
            unreadCount: 0,
        })),

    deleteNotification: (id) =>
        set((state) => {
            const updated = state.notifications.filter((item) => item.id !== id);
            return {
                notifications: updated,
                unreadCount: updated.filter((item) => !item.is_read).length,
            };
        }),

    clearAllNotifications: () =>
        set({
            notifications: [],
            unreadCount: 0,
        }),

    addNotification: (notification) =>
        set((state) => {
            const updated = [notification, ...state.notifications];
            return {
                notifications: updated,
                unreadCount: updated.filter((item) => !item.is_read).length,
            };
        }),

    getUnreadCount: () => {
        const { unreadCount, notifications } = get();
        if (unreadCount !== undefined && unreadCount > 0) return unreadCount;
        return notifications.filter((item) => !item.is_read).length;
    },
}));
