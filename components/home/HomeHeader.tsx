import {icons} from "@/constants/icons";
import {useThemeStore} from "@/store/theme.store";
import React from "react";
import { Image, Pressable, Text, View} from "react-native";
import Icon from "../ui/icons/Icon";
import { useRouter } from "expo-router";

const HomeHeader = () => {
    const {isDark, toggleTheme} = useThemeStore();
    const router = useRouter();

    return (
        <View className="home-header">
            <View className="flex-row gap-1 items-center">
                <Pressable
                    onPress={toggleTheme}
                    className="header-buttons p-2 rounded-full active:opacity-60">
                    <Icon
                        icon={isDark ? icons.sun : icons.moon}
                        size={22}
                        className={isDark ? "text-amber-400" : "text-primary"}
                        color={isDark ? "#f59e0b" : "#081126"}
                    />
                </Pressable>
                <Pressable
                    onPress={() => console.log("notification pressed")}
                    className="header-buttons p-2 rounded-full active:opacity-60">
                    <Icon
                        icon={icons.bell}
                        size={22}
                        className="home-icons"
                        color={isDark ? "#ffffff" : "#081126"}
                    />
                </Pressable>
                <Pressable
                    onPress={() => router.push("/(auth)/login")}
                    className="header-buttons p-2 rounded-full active:opacity-60">
                    <Icon
                        icon={icons.bell}
                        size={22}
                        className="home-icons"
                        color={isDark ? "#ffffff" : "#081126"}
                    />
                </Pressable>
            </View>

            {/* الصوره و الاسم */}
            <View className="home-user">
                {/* الاسم */}
                <View>
                    <View>
                        <Text
                            className={`mr-2 text-xs text-right font-sans-bold ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                            مرحبا بكم في تطبيق
                        </Text>
                        <Text
                            className={`mr-2 text-lg text-right font-sans-bold ${isDark ? "text-white" : "text-primary"}`}>
                            مستشفى التعاون
                        </Text>
                    </View>
                </View>
                {/* الصوره */}
                <Image source={icons.logo} className="home-avatar" />
            </View>
        </View>
    );
};

export default HomeHeader;
