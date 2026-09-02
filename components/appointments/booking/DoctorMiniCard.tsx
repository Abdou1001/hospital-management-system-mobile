import React from "react";
import { Image, Text, View } from "react-native";

interface DoctorMiniCardProps {
    doctor: any;
    imageSource: any;
    totalFee: number;
    isDark: boolean;
}

const DoctorMiniCard: React.FC<DoctorMiniCardProps> = ({
    doctor,
    imageSource,
    totalFee,
    isDark,
}) => {
    return (
        <View
            className={`mb-5 flex-row-reverse items-center gap-3 rounded-2xl border p-3 ${
                isDark
                    ? "border-slate-700/60 bg-slate-800"
                    : "border-slate-100 bg-white"
            }`}>
            <View
                className={`h-16 w-14 overflow-hidden rounded-xl ${
                    isDark ? "bg-slate-700" : "bg-slate-100"
                }`}>
                <Image
                    source={imageSource}
                    resizeMode="cover"
                    className="size-full"
                />
            </View>
            <View className="flex-1">
                <Text
                    className={`text-right font-sans-bold text-base ${
                        isDark ? "text-white" : "text-slate-800"
                    }`}>
                    {doctor.full_name}
                </Text>
                <Text className="mt-0.5 text-right font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                    الرسوم الإجمالية: {totalFee} ر.ي
                </Text>
            </View>
            <View className="rounded-full bg-green-500/10 px-2.5 py-1">
                <Text className="font-sans-bold text-xs text-green-600 dark:text-green-400">
                    متاح
                </Text>
            </View>
        </View>
    );
};

export default DoctorMiniCard;
