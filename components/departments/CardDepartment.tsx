import { useThemeStore } from "@/store/theme.store";
import {useRouter} from "expo-router";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface CardDepartmentProps {
    id?: string | number;
    name: string;
    image: any;
    onPress?: () => void;
    className?: string;
}

const CardDepartment: React.FC<CardDepartmentProps> = ({
    id,
    name,
    image,
    onPress,
    className = "",
}) => {
    const router = useRouter();
    // حالة الـ Dark Mode
        const {isDark} = useThemeStore();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (id) {
            router.push(`/department/${id}` as any);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            className={`w-[30%] items-center justify-center shadow-sm py-3.5 px-1 rounded-2xl bg-white dark:bg-slate-800 border ${
                isDark
                    ? "border-slate-700/60 bg-slate-800"
                    : "border-slate-200 bg-white"
            } ${className}`}>
            <View className="w-15 h-15 items-center justify-center mb-2">
                <Image
                    source={image}
                    className="size-14"
                    resizeMode="contain"
                />
            </View>
            <Text
                numberOfLines={1}
                className="text-sm font-sans-bold text-slate-800 dark:text-slate-100 text-center mt-1">
                {name}
            </Text>
        </TouchableOpacity>
    );
};

export default CardDepartment;
