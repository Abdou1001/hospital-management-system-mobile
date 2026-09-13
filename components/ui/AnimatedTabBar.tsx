import { components } from "@/constants/theme";
import { useThemeStore } from "@/store/theme.store";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    LayoutChangeEvent,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Constants ───────────────────────────────────────────────────────────────
const tabBar = components.tabBar;
const ACTIVE_SIZE = 65;

// ─── Types ───────────────────────────────────────────────────────────────────
export interface AnimatedTabItem {
    /** Unique key for this tab (matches route name) */
    name: string;
    /** Label displayed under the icon */
    title: string;
    /**
     * Render the icon. Receives `isActive` and the resolved `color`
     * so each consumer can use SVG icons, Ionicons, etc.
     */
    renderIcon: (isActive: boolean, color: string) => React.ReactNode;
    /** Optional badge count shown as an amber pill */
    badge?: number;
}

export interface AnimatedTabBarProps {
    tabs: AnimatedTabItem[];
    /** Index of the currently active tab */
    currentIndex: number;
    /** Called when the user presses a tab */
    onTabPress: (index: number, name: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
    tabs,
    currentIndex,
    onTabPress,
}) => {
    const { isDark } = useThemeStore();
    const insets = useSafeAreaInsets();

    const [barWidth, setBarWidth] = React.useState(0);
    const animatedX = useRef(new Animated.Value(0)).current;

    const tabWidth = barWidth > 0 ? barWidth / tabs.length : 0;

    // Animate the circle to the active tab
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

    const handleLayout = (e: LayoutChangeEvent) => {
        setBarWidth(e.nativeEvent.layout.width);
    };

    return (
        <View
            onLayout={handleLayout}
            className={`absolute overflow-hidden rounded-3xl border shadow-xl ${
                isDark
                    ? "bg-[#1e293b] border-slate-700/60"
                    : "bg-white border-black/10"
            }`}
            style={{
                left: tabBar.horizontalInset,
                right: tabBar.horizontalInset,
                bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                height: tabBar.height,
                borderRadius: tabBar.radius,
            }}>
            {/* Animated circle */}
            {barWidth > 0 && (
                <Animated.View
                    pointerEvents="none"
                    className="absolute rounded-full bg-main"
                    style={{
                        width: ACTIVE_SIZE,
                        height: ACTIVE_SIZE,
                        top: tabBar.height / 2 - ACTIVE_SIZE / 1.95,
                        transform: [{ translateX: animatedX }],
                    }}
                />
            )}

            {/* Tab items */}
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
                            onPress={() => onTabPress(index, tab.name)}
                            className="flex-1 items-center justify-center">
                            <View className="size-[68px] items-center justify-center">
                                {/* Icon + optional badge */}
                                <View className="relative">
                                    {tab.renderIcon(isActive, iconColor)}

                                    {tab.badge !== undefined &&
                                        tab.badge > 0 && (
                                            <View className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 items-center justify-center">
                                                <Text className="font-sans-bold text-[9px] text-white">
                                                    {tab.badge > 99
                                                        ? "99+"
                                                        : tab.badge}
                                                </Text>
                                            </View>
                                        )}
                                </View>

                                <Text
                                    className={`mt-[3px] text-[10px] ${textStyle}`}
                                    style={{ textAlign: "center" }}>
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

export default AnimatedTabBar;
