import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

export const UserProfileSkeleton: React.FC = () => {
    const { isDark } = useThemeStore();

    return (
        <View className="w-full mb-5">
            {/* Section label placeholder */}
            <View
                style={{
                    width: 110,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                    alignSelf: "flex-end",
                    marginBottom: 12,
                    marginHorizontal: 4,
                }}
            />
            <SkeletonWrapper>
                <View
                    className={`w-full rounded-3xl border p-5 shadow-sm ${
                        isDark ? "border-slate-800 bg-slate-800/90" : "border-slate-100 bg-white"
                    }`}>
                    {/* Avatar + Name + Badges */}
                    <View
                        style={{
                            flexDirection: "row-reverse",
                            alignItems: "center",
                            gap: 16,
                            paddingBottom: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,1)",
                            marginBottom: 16,
                        }}>
                        {/* Avatar */}
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                backgroundColor: "#000",
                            }}
                        />
                        {/* Name & Role */}
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <View
                                style={{
                                    width: "65%",
                                    height: 20,
                                    borderRadius: 6,
                                    backgroundColor: "#000",
                                    marginBottom: 8,
                                }}
                            />
                            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                                <View
                                    style={{
                                        width: 75,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: "#000",
                                    }}
                                />
                                <View
                                    style={{
                                        width: 60,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: "#000",
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Info rows */}
                    {[1, 2, 3].map((item) => (
                        <View
                            key={item}
                            style={{
                                flexDirection: "row-reverse",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 12,
                                borderBottomWidth: item < 3 ? 1 : 0,
                                borderBottomColor: isDark
                                    ? "rgba(51,65,85,0.5)"
                                    : "rgba(226,232,240,0.8)",
                            }}>
                            <View
                                style={{
                                    width: "45%",
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                }}
                            />
                            <View
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                    backgroundColor: "#000",
                                }}
                            />
                        </View>
                    ))}
                </View>
            </SkeletonWrapper>
        </View>
    );
};

export default UserProfileSkeleton;
