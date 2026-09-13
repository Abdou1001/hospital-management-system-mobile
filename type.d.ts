import type {ImageSourcePropType} from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: any;
    }

    interface DepartmentItem {
        id: string | number;
        name: string;
        image: ImageSourcePropType;
    }

    interface DoctorsItem {
        id: string | number;
        name: string;
        bio: string;
        image: ImageSourcePropType;
    }

    interface ShowDepartmentsProps {
        data?: any[];
        isLoading?: boolean;
        limit?: number;
    }

    interface ShowDoctorsProps {
        data?: any[];
        isLoading?: boolean;
        limit?: number;
    }

    export type NotificationType =
        | "system"
        | "ad"
        | "discovery"
        | "appointment"
        | "reminder";
}

export {};
