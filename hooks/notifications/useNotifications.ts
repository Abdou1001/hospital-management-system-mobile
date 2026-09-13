import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notification.store";
import {
    getNotificationsApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi,
    deleteNotificationApi,
    deleteAllNotificationsApi,
} from "@/api/notifications.api";
import { AppNotification, NotificationFilter } from "@/types/notifications.type";
import Toast from "react-native-toast-message";
import { useMemo } from "react";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export function useNotifications(filter: NotificationFilter = "all") {
    const queryClient = useQueryClient();
    const storeNotifications = useNotificationStore((state) => state.notifications);
    const storeSetNotifications = useNotificationStore((state) => state.setNotifications);
    const storeSetUnreadCount = useNotificationStore((state) => state.setUnreadCount);
    const storeMarkAsRead = useNotificationStore((state) => state.markAsRead);
    const storeMarkAllAsRead = useNotificationStore((state) => state.markAllAsRead);
    const storeDelete = useNotificationStore((state) => state.deleteNotification);
    const storeClearAll = useNotificationStore((state) => state.clearAllNotifications);

    // Main Query: fetches real notifications from backend
    const query = useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEY,
        queryFn: async () => {
            const response = await getNotificationsApi();
            const list = Array.isArray(response?.results) ? response.results : [];
            storeSetNotifications(list);
            if (typeof response?.unread_count === "number") {
                storeSetUnreadCount(response.unread_count);
            }
            return list;
        },
        staleTime: 1000 * 30, // 30 sec
    });

    const notifications = query.data ?? storeNotifications;

    // Filtered list
    const filteredNotifications = useMemo(() => {
        if (!notifications) return [];
        switch (filter) {
            case "unread":
                return notifications.filter((item) => !item.is_read);
            case "appointment":
                return notifications.filter(
                    (item) => item.type === "appointment" || item.type === "reminder"
                );
            case "system":
                return notifications.filter(
                    (item) =>
                        item.type === "system" ||
                        item.type === "ad" ||
                        item.type === "discovery"
                );
            case "all":
            default:
                return notifications;
        }
    }, [notifications, filter]);

    // Counts for tabs
    const counts = useMemo(() => {
        const allCount = notifications.length;
        const unreadCount = notifications.filter((n) => !n.is_read).length;
        const appointmentCount = notifications.filter(
            (n) => n.type === "appointment" || n.type === "reminder"
        ).length;
        const systemCount = notifications.filter(
            (n) =>
                n.type === "system" ||
                n.type === "ad" ||
                n.type === "discovery"
        ).length;

        return {
            all: allCount,
            unread: unreadCount,
            appointment: appointmentCount,
            system: systemCount,
        };
    }, [notifications]);

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            storeMarkAsRead(id);
            await markNotificationAsReadApi(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData<AppNotification[]>(
                NOTIFICATIONS_QUERY_KEY,
                (old) => (old ? old.map((n) => (n.id === id ? { ...n, is_read: true } : n)) : [])
            );
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            storeMarkAllAsRead();
            await markAllNotificationsAsReadApi();
        },
        onSuccess: () => {
            queryClient.setQueryData<AppNotification[]>(
                NOTIFICATIONS_QUERY_KEY,
                (old) => (old ? old.map((n) => ({ ...n, is_read: true })) : [])
            );
            Toast.show({
                type: "success",
                text1: "تم التحديث",
                text2: "تم تعيين جميع الإشعارات كمقروءة",
            });
        },
    });

    // Delete single notification mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            storeDelete(id);
            await deleteNotificationApi(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData<AppNotification[]>(
                NOTIFICATIONS_QUERY_KEY,
                (old) => (old ? old.filter((n) => n.id !== id) : [])
            );
            Toast.show({
                type: "info",
                text1: "تم الحذف",
                text2: "تم حذف الإشعار بنجاح",
            });
        },
    });

    // Clear all notifications
    const clearAllMutation = useMutation({
        mutationFn: async () => {
            storeClearAll();
            await deleteAllNotificationsApi();
        },
        onSuccess: () => {
            queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY, []);
            Toast.show({
                type: "info",
                text1: "تم المسح",
                text2: "تم مسح جميع الإشعارات",
            });
        },
    });

    return {
        ...query,
        notifications: filteredNotifications,
        allNotifications: notifications,
        counts,
        unreadCount: counts.unread,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        isMarkingAll: markAllAsReadMutation.isPending,
        deleteNotification: deleteMutation.mutate,
        clearAllNotifications: clearAllMutation.mutate,
        isClearingAll: clearAllMutation.isPending,
    };
}
