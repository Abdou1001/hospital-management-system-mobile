import Icon from "@/components/ui/icons/Icon";
import {tabs} from "@/constants/data";
import {colors, components} from "@/constants/theme";
import {Tabs, usePathname, useRouter} from "expo-router";
import type {Href} from "expo-router";
import React, {useEffect, useRef} from "react";
import {
    Animated,
    LayoutChangeEvent,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { useThemeStore } from "@/store/theme.store";

// Tab Bar configuration
const tabBar = components.tabBar;

const ACTIVE_SIZE = 65;

const CustomTabBar = () => {
    // Safe Area
    const insets = useSafeAreaInsets();
    const {isDark} = useThemeStore();

    const router = useRouter();
    const pathname = usePathname();

    const [barWidth, setBarWidth] = React.useState(0);

    const animatedX = useRef(new Animated.Value(0)).current;

    /*
     * معرفة الـ Tab الحالي
     */
    const activeIndex = tabs.findIndex((tab) => {
        if (tab.name === "index") {
            return pathname === "/" || pathname === "/index";
        }

        return pathname.includes(`/${tab.name}`);
    });

    const currentIndex = activeIndex === -1 ? 0 : activeIndex;

    /*
     * حساب عرض كل Tab
     */
    const tabWidth = barWidth > 0 ? barWidth / tabs.length : 0;

    /*
     * تحريك الدائرة عند تغيير الـ Tab
     */
    useEffect(() => {
        if (tabWidth === 0) return;

        const targetX =
            currentIndex * tabWidth + tabWidth / 2 - ACTIVE_SIZE / 1.9;

        Animated.spring(animatedX, {
            toValue: targetX,
            useNativeDriver: true,
            damping: 18,
            stiffness: 180,
            mass: 0.7,
        }).start();
    }, [currentIndex, tabWidth]);

    /*
     * معرفloginة عرض الـ Tab Bar
     */
    const handleLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;

        setBarWidth(width);
    };

    return (
        <View
            onLayout={handleLayout}
            className={`absolute overflow-hidden rounded-3xl ${
                isDark
                    ? "bg-[#1e293b] border-slate-700/60"
                    : "bg-white border-black/10"
            } border shadow-xl`}
            style={{
                left: tabBar.horizontalInset,
                right: tabBar.horizontalInset,
                bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                height: tabBar.height,
                borderRadius: tabBar.radius,
            }}>
            {/* 
                الدائرة المتحركة
            */}
            {barWidth > 0 && (
                <Animated.View
                    pointerEvents="none"
                    className="absolute rounded-full bg-main"
                    style={{
                        width: ACTIVE_SIZE,
                        height: ACTIVE_SIZE,
                        top: tabBar.height / 2 - ACTIVE_SIZE / 1.95,

                        transform: [
                            {
                                translateX: animatedX,
                            },
                        ],
                    }}
                />
            )}

            {/* Tabs */}
            <View className="flex-1 flex-row">
                {tabs.map((tab, index) => {
                    const isActive = index === currentIndex;

                    const iconColor = isActive
                        ? "#ffffff"
                        : isDark
                          ? "rgba(255, 255, 255, 0.7)"
                          : "#334155";

                    const textStyle = isActive
                        ? "text-white font-sans-bold"
                        : isDark
                          ? "text-slate-400 font-sans-medium"
                          : "text-slate-700 font-sans-medium";

                    return (
                        <TouchableOpacity
                            key={tab.name}
                            activeOpacity={0.8}
                            onPress={() => {
                                const route = (
                                    tab.name === "index"
                                        ? "/(tabs)"
                                        : `/(tabs)/${tab.name}`
                                ) as Href;

                                router.push(route);
                            }}
                            className="flex-1 items-center justify-center">
                            <View className="size-[68px] items-center justify-center">
                                <Icon
                                    icon={tab.icon}
                                    size={24}
                                    color={iconColor}
                                />

                                <Text
                                    className={`mt-[3px] text-[11px] ${textStyle}`}
                                    style={{
                                        textAlign: "center",
                                    }}>
                                    {tab.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const TabLayout = () => {
    return (
        <Tabs
            tabBar={() => <CustomTabBar />}
            screenOptions={{
                headerShown: false,
            }}>
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                    }}
                />
            ))}
        </Tabs>
    );
};

export default TabLayout;
