import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";

export const BookingPageSkeleton: React.FC = () => {
    const { isDark } = useThemeStore();

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5">
                <SkeletonWrapper>
                    <View className="flex-1">
                        {/* Header bar */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 16,
                            }}>
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#000",
                                }}
                            />
                            <View
                                style={{
                                    width: 110,
                                    height: 22,
                                    borderRadius: 6,
                                    backgroundColor: "#000",
                                }}
                            />
                            <View style={{ width: 40 }} />
                        </View>

                        {/* Doctor Mini Card */}
                        <View
                            className={`rounded-3xl border p-4 mb-5 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800/40"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <View
                                style={{
                                    flexDirection: "row-reverse",
                                    alignItems: "center",
                                    gap: 14,
                                }}>
                                <View
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 16,
                                        backgroundColor: "#000",
                                    }}
                                />
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            width: "70%",
                                            height: 18,
                                            borderRadius: 6,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                            marginBottom: 8,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: "45%",
                                            height: 14,
                                            borderRadius: 4,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Form Skeleton Card */}
                        <View
                            className={`rounded-3xl border p-5 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800/40"
                                    : "border-slate-100 bg-white"
                            }`}>
                            {/* Schedule picker input */}
                            <View
                                style={{
                                    width: 100,
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 8,
                                }}
                            />
                            <View
                                style={{
                                    height: 52,
                                    borderRadius: 16,
                                    backgroundColor: "#000",
                                    marginBottom: 16,
                                }}
                            />

                            {/* Date input */}
                            <View
                                style={{
                                    width: 90,
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 8,
                                }}
                            />
                            <View
                                style={{
                                    height: 52,
                                    borderRadius: 16,
                                    backgroundColor: "#000",
                                    marginBottom: 16,
                                }}
                            />

                            {/* Patient Name input */}
                            <View
                                style={{
                                    width: 80,
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 8,
                                }}
                            />
                            <View
                                style={{
                                    height: 52,
                                    borderRadius: 16,
                                    backgroundColor: "#000",
                                    marginBottom: 16,
                                }}
                            />

                            {/* Submit Button */}
                            <View
                                style={{
                                    height: 52,
                                    borderRadius: 16,
                                    backgroundColor: "#000",
                                    marginTop: 10,
                                }}
                            />
                        </View>
                    </View>
                </SkeletonWrapper>
            </SafeAreaView>
        </View>
    );
};

export default BookingPageSkeleton;
