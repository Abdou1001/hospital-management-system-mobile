import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

interface DepartmentCardSkeletonProps {
    count?: number;
}

const SingleDepartmentSkeleton = ({ isDark }: { isDark: boolean }) => (
    <View
        className={`w-[23%] items-center justify-center py-3.5 px-1 rounded-2xl border ${
            isDark
                ? "border-slate-700/60 bg-slate-800/40"
                : "border-slate-100 bg-white"
        }`}>
        {/* Icon placeholder */}
        <View
            style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: "#000",
                marginBottom: 8,
            }}
        />
        {/* Name line */}
        <View
            style={{
                width: "75%",
                height: 10,
                borderRadius: 4,
                backgroundColor: "#000",
            }}
        />
    </View>
);

export const DepartmentCardSkeleton: React.FC<DepartmentCardSkeletonProps> = ({
    count = 8,
}) => {
    const { isDark } = useThemeStore();
    const items = Array.from({ length: count });

    return (
        <View className="w-full">
            <SkeletonWrapper>
                <View className="flex-row-reverse flex-wrap justify-between gap-y-4">
                    {items.map((_, index) => (
                        <SingleDepartmentSkeleton key={index} isDark={isDark} />
                    ))}
                </View>
            </SkeletonWrapper>
        </View>
    );
};

export default DepartmentCardSkeleton;
