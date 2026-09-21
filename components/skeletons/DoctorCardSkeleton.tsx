import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

interface DoctorCardSkeletonProps {
    count?: number;
}

const SingleDoctorSkeleton = ({ isDark }: { isDark: boolean }) => (
    <View
        className={`w-full overflow-hidden rounded-3xl mt-3 border p-3.5 ${
            isDark ? "border-slate-700/60 bg-slate-800/40" : "border-slate-100 bg-white"
        }`}>
        {/* Top row */}
        <View style={{ flexDirection: "row-reverse", alignItems: "flex-start" }}>
            {/* Image placeholder */}
            <View
                style={{
                    width: 105,
                    height: 120,
                    borderRadius: 16,
                    backgroundColor: "#000",
                }}
            />

            {/* Info placeholder */}
            <View style={{ marginRight: 12, flex: 1 }}>
                {/* Doctor Name */}
                <View
                    style={{
                        width: "75%",
                        height: 18,
                        borderRadius: 6,
                        backgroundColor: "#000",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                    }}
                />

                {/* Department badge */}
                <View
                    style={{
                        width: 90,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "#000",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                    }}
                />

                {/* Rating / Experience pills */}
                <View
                    style={{
                        flexDirection: "row-reverse",
                        gap: 6,
                        marginBottom: 8,
                    }}>
                    <View
                        style={{
                            width: 60,
                            height: 18,
                            borderRadius: 6,
                            backgroundColor: "#000",
                        }}
                    />
                    <View
                        style={{
                            width: 70,
                            height: 18,
                            borderRadius: 6,
                            backgroundColor: "#000",
                        }}
                    />
                </View>

                {/* Fee text */}
                <View
                    style={{
                        width: "50%",
                        height: 14,
                        borderRadius: 4,
                        backgroundColor: "#000",
                        alignSelf: "flex-end",
                    }}
                />
            </View>
        </View>

        {/* Bio text lines */}
        <View style={{ marginTop: 12, gap: 6 }}>
            <View
                style={{
                    width: "100%",
                    height: 12,
                    borderRadius: 4,
                    backgroundColor: "#000",
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

        {/* Action Button */}
        <View
            style={{
                marginTop: 12,
                height: 42,
                borderRadius: 16,
                backgroundColor: "#000",
                width: "100%",
            }}
        />
    </View>
);

export const DoctorCardSkeleton: React.FC<DoctorCardSkeletonProps> = ({ count = 1 }) => {
    const { isDark } = useThemeStore();
    const items = Array.from({ length: count });

    return (
        <View className="w-full gap-4">
            {items.map((_, index) => (
                <SkeletonWrapper key={index}>
                    <SingleDoctorSkeleton isDark={isDark} />
                </SkeletonWrapper>
            ))}
        </View>
    );
};

export default DoctorCardSkeleton;
