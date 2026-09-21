import AnimatedTabBar, {
    AnimatedTabItem,
} from "@/components/ui/AnimatedTabBar";
import Icon from "@/components/ui/icons/Icon";
import { tabs } from "@/constants/data";
import type { Href } from "expo-router";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";

const CustomTabBar = () => {
    const router = useRouter();
    const pathname = usePathname();

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

    // Map app tabs → AnimatedTabItem shape
    const tabItems: AnimatedTabItem[] = tabs.map((tab) => ({
        name: tab.name,
        title: tab.title,
        renderIcon: (_isActive, color) => (
            <Icon icon={tab.icon} size={24} color={color} />
        ),
    }));

    const handleTabPress = (_index: number, name: string) => {
        const route = (
            name === "index" ? "/(tabs)" : `/(tabs)/${name}`
        ) as Href;
        router.push(route);
    };

    return (
        <AnimatedTabBar
            tabs={tabItems}
            currentIndex={currentIndex}
            onTabPress={handleTabPress}
        />
    );
};

export const unstable_settings = {
    initialRouteName: "index",
};

const TabLayout = () => {
    return (
        <Tabs
            initialRouteName="index"
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
