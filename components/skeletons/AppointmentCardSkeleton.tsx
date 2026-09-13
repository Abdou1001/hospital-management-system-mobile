import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

interface AppointmentCardSkeletonProps {
    count?: number;
}

const SingleAppointmentSkeleton = ({ isDark }: { isDark: boolean }) => (
    <View
        className={`w-full overflow-hidden rounded-3xl border p-4 shadow-sm mb-4 ${
            isDark ? "border-slate-700/60 bg-slate-800/40" : "border-slate-100 bg-white"
        }`}>
        {/* Status bar placeholder */}
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 12 }}>
            <View
                style={{
                    width: 100,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#000",
                }}
            />
            <View
                style={{
                    width: 60,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: "#000",
                }}
            />
        </View>

        {/* Doctor image and details */}
        <View style={{ flexDirection: "row-reverse", alignItems: "flex-start" }}>
            {/* Image */}
            <View
                style={{
                    width: 90,
                    height: 105,
                    borderRadius: 16,
                    backgroundColor: "#000",
                }}
            />

            {/* Info */}
            <View style={{ marginRight: 12, flex: 1 }}>
                {/* Doctor Name */}
                <View
                    style={{
                        width: "80%",
                        height: 18,
                        borderRadius: 6,
                        backgroundColor: "#000",
                        marginBottom: 8,
                        alignSelf: "flex-end",
                    }}
                />
                {/* Department / Specialty */}
                <View
                    style={{
                        width: "60%",
                        height: 14,
                        borderRadius: 4,
                        backgroundColor: "#000",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                    }}
                />
                {/* Patient Name */}
                <View
                    style={{
                        width: "50%",
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: "#000",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                    }}
                />
                {/* Date & Time pill */}
                <View
                    style={{
                        width: "90%",
                        height: 26,
                        borderRadius: 8,
                        backgroundColor: "#000",
                        alignSelf: "flex-end",
                    }}
                />
            </View>
        </View>

        {/* Bottom actions row */}
        <View
            style={{
                marginTop: 14,
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: isDark ? "rgba(51,65,85,0.4)" : "rgba(241,245,249,0.8)",
            }}>
            <View
                style={{
                    width: 90,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: "#000",
                }}
            />
            <View
                style={{
                    width: 80,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: "#000",
                }}
            />
        </View>
    </View>
);

export const AppointmentCardSkeleton: React.FC<AppointmentCardSkeletonProps> = ({
    count = 3,
}) => {
    const { isDark } = useThemeStore();
    const items = Array.from({ length: count });

    return (
        <View className="w-full">
            {items.map((_, index) => (
                <SkeletonWrapper key={index}>
                    <SingleAppointmentSkeleton isDark={isDark} />
                </SkeletonWrapper>
            ))}
        </View>
    );
};

export default AppointmentCardSkeleton;
