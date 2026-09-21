import React from "react";
import { View, ScrollView } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";
import { useThemeStore } from "@/store/theme.store";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export const DoctorDetailsSkeleton: React.FC = () => {
    const { isDark } = useThemeStore();

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 pb-28">
                <SkeletonWrapper>
                    <View>
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
                                    width: 120,
                                    height: 22,
                                    borderRadius: 6,
                                    backgroundColor: "#000",
                                }}
                            />
                            <View style={{ width: 40 }} />
                        </View>

                        {/* Main Doctor Card */}
                        <View
                            className={`overflow-hidden rounded-3xl border p-4 shadow-sm mb-4 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800/40"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <View
                                style={{
                                    flexDirection: "row-reverse",
                                    alignItems: "center",
                                    gap: 16,
                                }}>
                                {/* Doctor Image */}
                                <View
                                    style={{
                                        width: 112,
                                        height: 128,
                                        borderRadius: 16,
                                        backgroundColor: "#000",
                                    }}
                                />

                                {/* Info */}
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            width: "80%",
                                            height: 22,
                                            borderRadius: 6,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                            marginBottom: 8,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: 80,
                                            height: 18,
                                            borderRadius: 9,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                            marginBottom: 10,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: 90,
                                            height: 22,
                                            borderRadius: 11,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                            marginBottom: 8,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: "70%",
                                            height: 14,
                                            borderRadius: 4,
                                            backgroundColor: "#000",
                                            alignSelf: "flex-end",
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Bio Section Card */}
                        <View
                            className={`rounded-3xl border p-5 mb-4 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800/40"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <View
                                style={{
                                    width: 110,
                                    height: 18,
                                    borderRadius: 6,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 12,
                                }}
                            />
                            <View
                                style={{
                                    width: "100%",
                                    height: 12,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    marginBottom: 8,
                                }}
                            />
                            <View
                                style={{
                                    width: "90%",
                                    height: 12,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 8,
                                }}
                            />
                            <View
                                style={{
                                    width: "65%",
                                    height: 12,
                                    borderRadius: 4,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                }}
                            />
                        </View>

                        {/* Working Schedules Card */}
                        <View
                            className={`rounded-3xl border p-5 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800/40"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <View
                                style={{
                                    width: 100,
                                    height: 18,
                                    borderRadius: 6,
                                    backgroundColor: "#000",
                                    alignSelf: "flex-end",
                                    marginBottom: 12,
                                }}
                            />
                            <View style={{ gap: 10 }}>
                                {[1, 2, 3].map((item) => (
                                    <View
                                        key={item}
                                        style={{
                                            height: 48,
                                            borderRadius: 16,
                                            backgroundColor: "#000",
                                            width: "100%",
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                </SkeletonWrapper>
            </SafeAreaView>

            {/* Bottom Floating Bar */}
            <View
                className={`absolute bottom-0 left-0 right-0 border-t p-4 px-5 ${
                    isDark
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                }`}>
                <SkeletonWrapper>
                    <View
                        style={{
                            flexDirection: "row-reverse",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <View
                            style={{
                                width: 100,
                                height: 36,
                                borderRadius: 8,
                                backgroundColor: "#000",
                            }}
                        />
                        <View
                            style={{
                                width: 140,
                                height: 48,
                                borderRadius: 16,
                                backgroundColor: "#000",
                            }}
                        />
                    </View>
                </SkeletonWrapper>
            </View>
        </View>
    );
};

export default DoctorDetailsSkeleton;
