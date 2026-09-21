import DepartmentCardSkeleton from "@/components/skeletons/DepartmentCardSkeleton";
import images from "@/constants/images";
import {useThemeStore} from "@/store/theme.store";
import React from "react";
import {Text, View} from "react-native";
import CardDepartment from "./CardDepartment";

export const getDepartmentImageSource = (item: any) => {
    if (item.image && typeof item.image !== "string") {
        return item.image;
    }

    const path = item.path_image || item.image_url || item.image || item.url;

    if (typeof path === "string" && path.trim().length > 0) {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return {uri: path};
        }

        const baseUrl =
            process.env.EXPO_PUBLIC_STORAGE_URL ||
            process.env.EXPO_PUBLIC_API_URL ||
            "";
        ;
        const cleanBase = baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

        const cleanPath = path.startsWith("/") ? path : `/${path}`;

        return {
            uri: `${cleanBase}${cleanPath}`,
        };
    }

    return;
};

const ShowDepartments: React.FC<ShowDepartmentsProps> = ({
    data,
    isLoading,
    limit,
}) => {
    const {isDark} = useThemeStore();
    // Loading
    if (isLoading) {
        return <DepartmentCardSkeleton count={limit || 6} />;
    }

    /*
     * إذا data موجودة من API نستخدمها.
     * إذا data غير موجودة نستخدم البيانات التجريبية.
     */
    const rawList = data !== undefined ? data : [];

    const list = limit ? rawList.slice(0, limit) : rawList;

    // لا توجد أقسام
    if (list.length === 0) {
        return (
            <View
                className={`mt-4 items-center justify-center rounded-3xl border ${isDark ? "border-white/50 bg-slate-800" : "border-border bg-card"}  px-6 py-8`}>
                <Text
                    className={`mt-3 text-lg font-sans-bold ${isDark ? "text-white" : "text-primary"}`}>
                    لا توجد أقسام
                </Text>

                <Text
                    className={`mt-1 text-center text-sm font-sans-medium  ${isDark ? "text-gray-400" : "text-muted-foreground"}`}>
                    لا توجد أقسام متاحة حاليًا
                </Text>
            </View>
        );
    }

    return (
        <View className="mt-4 flex-row-reverse flex-wrap justify-between gap-y-4 ">
            {list.map((item: any, index: number) => {
                const id = item.depart_id || index;

                const name = item.depart_name || "";

                const imageSource = getDepartmentImageSource(item);

                return (
                    <CardDepartment
                        key={id}
                        id={id}
                        name={name}
                        image={imageSource}
                    />
                );
            })}
        </View>
    );
};

export default ShowDepartments;
