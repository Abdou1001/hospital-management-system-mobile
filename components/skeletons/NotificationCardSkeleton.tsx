import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

interface NotificationCardSkeletonProps {
    count?: number;
}

const SingleNotificationSkeleton = ({ isDark }: { isDark: boolean }) => (
    <View
        className={`w-full rounded-3xl border p-4 mb-3 ${
            isDark ? "border-slate-800/80 bg-slate-800/50" : "border-slate-100 bg-white"
        }`}>
        <View style={{ flexDirection: "row-reverse", alignItems: "flex-start", gap: 14 }}>
            {/* Icon Badge */}
            <View
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: "#000",
                    flexShrink: 0,
                }}
            />
            {/* Content */}
            <View style={{ flex: 1 }}>
                {/* Header row: badge + time */}
                <View
                    style={{
                        flexDirection: "row-reverse",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}>
                    <View
                        style={{
                            width: 55,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: "#000",
                        }}
                    />
                    <View
                        style={{
                            width: 65,
                            height: 12,
                            borderRadius: 4,
                            backgroundColor: "#000",
                        }}
                    />
                </View>
                {/* Title */}
                <View
                    style={{
                        width: "85%",
                        height: 16,
                        borderRadius: 5,
                        backgroundColor: "#000",
                        alignSelf: "flex-end",
                        marginBottom: 8,
                    }}
                />
                {/* Body lines */}
                <View
                    style={{
                        width: "100%",
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#000",
                        marginBottom: 6,
                    }}
                />
                <View
                    style={{
                        width: "70%",
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#000",
                        alignSelf: "flex-end",
                    }}
                />
            </View>
        </View>
    </View>
);

export const NotificationCardSkeleton: React.FC<NotificationCardSkeletonProps> = ({
    count = 5,
}) => {
    const { isDark } = useThemeStore();
    const items = Array.from({ length: count });

    return (
        <View className="w-full">
            {items.map((_, index) => (
                <SkeletonWrapper key={index}>
                    <SingleNotificationSkeleton isDark={isDark} />
                </SkeletonWrapper>
            ))}
        </View>
    );
};

export default NotificationCardSkeleton;
