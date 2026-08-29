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
            className={`w-[23%] items-center justify-center py-3.5 px-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm ${className}`}>
            <View className="w-15 h-15 items-center justify-center mb-2">
                <Image
                    source={image}
                    className="size-14"
                    resizeMode="contain"
                />
            </View>
            <Text
                numberOfLines={1}
                className="text-xs font-sans-bold text-slate-800 dark:text-slate-100 text-center mt-1">
                {name}
            </Text>
        </TouchableOpacity>
    );
};

export default CardDepartment;
