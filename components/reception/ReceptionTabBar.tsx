import AnimatedTabBar, {
    AnimatedTabItem,
} from "@/components/ui/AnimatedTabBar";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";

interface ReceptionTabBarProps extends BottomTabBarProps {
    pendingCount?: number;
}

const ReceptionTabBar: React.FC<ReceptionTabBarProps> = ({
    state,
    navigation,
    pendingCount = 0,
}) => {
    const tabItems: AnimatedTabItem[] = [
        {
            name: "all",
            title: "جميع",
            renderIcon: (isActive, color) => (
                <Ionicons
                    name={isActive ? "calendar" : "calendar-outline"}
                    size={22}
                    color={color}
                />
            ),
        },
        {
            name: "pending",
            title: "المعلقة",
            badge: pendingCount,
            renderIcon: (isActive, color) => (
                <Ionicons
                    name={isActive ? "time" : "time-outline"}
                    size={22}
                    color={color}
                />
            ),
        },
    ];

    const handleTabPress = (_index: number, name: string) => {
        const route = state.routes.find((r) => r.name === name);
        const event = navigation.emit({
            type: "tabPress",
            target: route?.key ?? name,
            canPreventDefault: true,
        });

        if (state.index !== _index && !event.defaultPrevented) {
            navigation.navigate(name);
        }
    };

    return (
        <AnimatedTabBar
            tabs={tabItems}
            currentIndex={state.index}
            onTabPress={handleTabPress}
        />
    );
};

export default ReceptionTabBar;

