import api from "@/lib/axios";
import { AppNotification, NotificationType } from "@/types/notifications.type";

export interface RawBackendNotification {
    notification_id: number;
    user_id?: number | null;
    title: string;
    message?: string;
    body?: string;
    content?: string;
    type: NotificationType;
    data?: any;
    created_at: string;
    is_read?: boolean;
    read_at?: string | null;
}

export interface GetNotificationsResponse {
    status: string;
    message: string;
    pagination?: {
        currentPage?: number;
        limit?: number;
        totalPages?: number;
        totalItems?: number;
        nextPage?: number | null;
        prevPage?: number | null;
    };
    unread_count: number;
    results: AppNotification[];
}

export function mapToAppNotification(
    item: RawBackendNotification | (AppNotification & { notification_id?: number })
): AppNotification {
    const rawId = item.notification_id ?? (item as any).id;
    return {
        id: String(rawId),
        notification_id: Number(rawId),
        user_id: item.user_id ?? null,
        title: item.title || "",
        message: item.message || (item as any).body || (item as any).content || "",
        type: item.type || "system",
        created_at: item.created_at || new Date().toISOString(),
        is_read: Boolean(item.is_read),
        read_at: item.read_at || null,
        data: item.data || {},
    };
}

// @Route GET /api/notifications
export async function getNotificationsApi(params?: {
    page?: number;
    limit?: number;
}): Promise<GetNotificationsResponse> {
    const { data } = await api.get("/notifications", {
        params,
    });

    const rawList: RawBackendNotification[] = Array.isArray(data?.results)
        ? data.results
        : [];

    return {
        status: data?.status || "success",
        message: data?.message || "",
        pagination: data?.pagination,
        unread_count: data?.unread_count ?? rawList.filter((n) => !n.is_read).length,
        results: rawList.map(mapToAppNotification),
    };
}

// @Route GET /api/notifications/:id
export async function getOneNotificationApi(
    id: string | number
): Promise<{ status: string; message: string; results: AppNotification }> {
    const { data } = await api.get(`/notifications/${id}`);
    return {
        status: data?.status || "success",
        message: data?.message || "",
        results: mapToAppNotification(data?.results),
    };
}

// @Route PATCH /api/notifications/:id/read
export async function markNotificationAsReadApi(id: string | number) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
}

// @Route PATCH /api/notifications/read-all
export async function markAllNotificationsAsReadApi() {
    const { data } = await api.patch("/notifications/read-all");
    return data;
}

// @Route DELETE /api/notifications/:id
export async function deleteNotificationApi(id: string | number) {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
}

// @Route DELETE /api/notifications
export async function deleteAllNotificationsApi() {
    const { data } = await api.delete("/notifications");
    return data;
}
