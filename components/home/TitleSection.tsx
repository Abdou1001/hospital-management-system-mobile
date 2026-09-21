import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Icon, { IconProps } from "../ui/icons/Icon";
import { icons } from "@/constants/icons";
import { useThemeStore } from "@/store/theme.store";

export interface TitleSectionProps {
    title: string;
    path: any;
    icon?: IconProps["icon"];
}

const TitleSection: React.FC<TitleSectionProps> = ({
    title,
    path,
    icon,
}) => {
    const { isDark } = useThemeStore();
    return (
        <View className="mt-5 flex-row-reverse justify-between items-center">
            <View className="flex-row-reverse items-center justify-center gap-2">
                {icon && (
                    <Icon
                        icon={icon}
                        size={30}
                        className="text-muted-foreground dark:text-slate-400"
                        color={isDark ? "#94a3b8" : "#6b7280"}
                    />
                )}
                <Text
                    className={`text-xl font-sans-bold mt-2 ${isDark ? "text-white" : "text-primary"}`}>
                    {title}
                </Text>
            </View>
            <View className="flex-row items-center justify-center">
                <Icon
                    icon={icons.leftArrow}
                    size={12}
                    style={{marginTop: 4}}
                    className="text-main mt-2"
                    color={"#16a34a"}
                />
                <Link href={path} className="text-main font-sans-bold text-xs mt-2">
                    عرض المزيد
                </Link>
            </View>
        </View>
    );
};

export default TitleSection;

