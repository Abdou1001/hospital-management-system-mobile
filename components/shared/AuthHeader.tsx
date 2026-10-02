import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { icons } from "@/constants/icons";
import { useHopitalName } from "@/store/hospital.store";
import { useThemeStore } from "@/store/theme.store";

interface AuthHeaderProps {
    title?: string;
    onBack?: () => void;
    showBack?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
    title,
    onBack,
    showBack = true,
}) => {
    const router = useRouter();
    const { name } = useHopitalName();
    const { isDark } = useThemeStore();

    const handleBack = () => {
        router.back();
    };

    return (
        <View className="h-100 w-full bg-main items-center justify-center rounded-b-[40px] pt-8 px-5 relative shadow-md">
            {/* زر العودة */}
            {showBack && (
                <Pressable
                    onPress={handleBack}
                    className={`size-10 items-center justify-center rounded-full absolute left-7 top-16 ${
                        isDark ? "bg-slate-800/70" : "bg-slate-100/70"
                    }`}>
                    <Image
                        source={icons.back}
                        className="size-5"
                        resizeMode="contain"
                        style={{
                            tintColor: isDark ? "#ffffff" : "#1e293b",
                        }}
                    />
                </Pressable>
            )}

            {/* كارت الشعار */}
            <View className="h-28 w-28 items-center justify-center rounded-3xl bg-white p-3 shadow">
                <Image
                    source={icons.logo}
                    resizeMode="contain"
                    className="size-full"
                />
            </View>

            {/* اسم المستشفى / العنوان */}
            <Text className="mt-3 font-sans-bold text-2xl text-white tracking-wide p-2 text-center">
                {title || name}
            </Text>
        </View>
    );
};

export default AuthHeader;
