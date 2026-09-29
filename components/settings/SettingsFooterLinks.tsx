import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useThemeStore } from "@/store/theme.store";

const ABOUT_US_URL = "https://front-j15qkf91g-abdou1001s-projects.vercel.app/about";
const TERMS_URL = "https://front-j15qkf91g-abdou1001s-projects.vercel.app/terms";

const SettingsFooterLinks = () => {
    const { isDark } = useThemeStore();

    const handleOpenLink = async (url: string) => {
        try {
            await WebBrowser.openBrowserAsync(url);
        } catch {
            Linking.openURL(url).catch(() => {});
        }
    };

    const iconColor = isDark ? "#94a3b8" : "#64748b";

    return (
        <View className="items-center justify-center mt-2 mb-6">
            <View className="flex-row-reverse items-center justify-center gap-1">
                {/* رابط من نحن */}
                <Pressable
                    onPress={() => handleOpenLink(ABOUT_US_URL)}
                    className="flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full active:opacity-60">
                    <Ionicons
                        name="information-circle-outline"
                        size={15}
                        color={iconColor}
                    />
                    <Text className="text-xs font-sans-medium text-slate-500 dark:text-slate-400">
                        من نحن
                    </Text>
                </Pressable>

                {/* فاصل أنيق */}
                <View className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

                {/* رابط سياسة الاستخدام */}
                <Pressable
                    onPress={() => handleOpenLink(TERMS_URL)}
                    className="flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full active:opacity-60">
                    <Ionicons
                        name="document-text-outline"
                        size={15}
                        color={iconColor}
                    />
                    <Text className="text-xs font-sans-medium text-slate-500 dark:text-slate-400">
                        سياسة الاستخدام
                    </Text>
                </Pressable>
            </View>

            {/* سطر فرعي هادئ لبيانات الإصدار والحقوق */}
            <Text className="text-[11px] font-sans text-slate-400 dark:text-slate-500 mt-2">
                جميع الحقوق محفوظة © {new Date().getFullYear()}
            </Text>
        </View>
    );
};

export default SettingsFooterLinks;
