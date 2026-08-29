import {useThemeStore} from "@/store/theme.store";
import React from "react";
import {Text, View} from "react-native";
import Icon, {IconProps} from "../ui/icons/Icon";

const SectionTitle = ({
    title,
    icon,
}: {
    title: string;
    icon?: IconProps["icon"];
}) => {
    const {isDark} = useThemeStore();
    return (
        <View className="flex-row-reverse items-center gap-2 mt-4">
            {icon && (
                <Icon
                    icon={icon}
                    size={30}
                    className="text-muted-foreground dark:text-slate-400"
                    color={isDark ? "#94a3b8" : "#6b7280"}
                />
            )}
            <Text
                className={`text-2xl font-sans-bold mt-2 ${isDark ? "text-white" : "text-primary"}`}>
                {title}
            </Text>
        </View>
    );
};

export default SectionTitle;
