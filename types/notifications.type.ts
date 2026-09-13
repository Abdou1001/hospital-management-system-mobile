export type NotificationType =
    | "system"
    | "ad"
    | "discovery"
    | "appointment"
    | "reminder";

export interface AppNotification {
    id: string;
    notification_id?: number;
    user_id?: number | null;
    title: string;
    message: string;
    type: NotificationType;
    created_at: string;
    is_read: boolean;
    read_at?: string | null;
    data?: {
        appointment_id?: number;
        doctor_id?: number;
        url?: string;
        status?: string;
        [key: string]: any;
    };
}

export type NotificationFilter = "all" | "unread" | "appointment" | "system";

export interface NotificationFilterOption {
    key: NotificationFilter;
    label: string;
    count?: number;
}
