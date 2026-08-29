import SectionTitle from "@/components/shared/SectionTitle";
import Icon from "@/components/ui/icons/Icon";
import { icons } from "@/constants/icons";
import { useThemeStore } from "@/store/theme.store";
import { styled } from "nativewind";
import React from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const {isDark, toggleTheme} = useThemeStore();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 bg-background dark:bg-slate-900 p-5">
            <SafeAreaView className="flex-1 mb-20">
                {/* title */}
                <SectionTitle title="ألاعدادات" icon={icons.setting}/>

                {/* General Settings Section */}
                <View className="mb-6 mt-3">
                    <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400 text-right mb-3 px-1">
                        المظهر والعرض
                    </Text>

                    {/* Dark Mode Switch Row */}
                    <View className="flex-row items-center justify-between bg-card dark:bg-slate-800 p-4 rounded-2xl border border-border dark:border-slate-700">
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{false: "#cbd5e1", true: "#16a34a"}}
                            thumbColor={isDark ? "#ffffff" : "#ffffff"}
                        />

                        <View className="flex-row items-center gap-3">
                            <View className="items-end">
                                <Text className="text-base font-sans-bold text-primary dark:text-slate-100 text-right">
                                    الوضع الداكن (Dark Mode)
                                </Text>
                                <Text className="text-xs font-sans-medium text-muted-foreground dark:text-slate-400 text-right">
                                    {isDark ? "مفعل" : "معطل"}
                                </Text>
                            </View>

                            <View className="size-10 rounded-xl bg-main/10 items-center justify-center">
                                <Icon
                                    icon={isDark ? icons.moon : icons.sun}
                                    size={20}
                                    className="text-main"
                                    color="#16a34a"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Additional Preferences */}
                <View className="mb-6">
                    <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400 text-right mb-3 px-1">
                        إعدادات أخرى
                    </Text>

                    <View className="bg-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 divide-y divide-border dark:divide-slate-700">
                        {/* Notifications */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4">
                            <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400">
                                مفعلة
                            </Text>
                            <View className="flex-row items-center gap-3">
                                <Text className="text-base font-sans-bold text-primary dark:text-slate-100 text-right">
                                    الإشعارات
                                </Text>
                                <View className="size-10 rounded-xl bg-main/10 items-center justify-center">
                                    <Icon
                                        icon={icons.bell}
                                        size={20}
                                        className="text-main"
                                        color="#16a34a"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* App Language */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4">
                            <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400">
                                العربية
                            </Text>
                            <View className="flex-row items-center gap-3">
                                <Text className="text-base font-sans-bold text-primary dark:text-slate-100 text-right">
                                    لغة التطبيق
                                </Text>
                                <View className="size-10 rounded-xl bg-main/10 items-center justify-center">
                                    <Icon
                                        icon={icons.setting}
                                        size={20}
                                        className="text-main"
                                        color="#16a34a"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Settings;
