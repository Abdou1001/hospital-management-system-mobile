import React from "react";
import { Text, View } from "react-native";

interface FeesSummaryProps {
    doctorFee: number;
    appFee: number;
    totalFee: number;
    isDark: boolean;
}

const FeesSummary: React.FC<FeesSummaryProps> = ({
    doctorFee,
    appFee,
    totalFee,
    isDark,
}) => {
    return (
        <View
            className={`mt-5 rounded-2xl border p-4 ${
                isDark
                    ? "border-slate-700 bg-slate-900/40"
                    : "border-slate-200 bg-slate-50"
            }`}>
            <Text
                className={`mb-3 font-sans-bold text-sm ${
                    isDark ? "text-white" : "text-slate-800"
                }`}
                style={{ textAlign: "right" }}>
                ملخص الرسوم
            </Text>
            <View className="gap-2">
                <View className="flex-row-reverse justify-between">
                    <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        رسوم الكشفية:
                    </Text>
                    <Text className={`font-sans-semibold text-xs ${isDark ? "text-white" : "text-slate-800"}`}>
                        {doctorFee} ر.ي
                    </Text>
                </View>
                <View className="flex-row-reverse justify-between">
                    <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        رسوم الخدمة والتطبيق:
                    </Text>
                    <Text className={`font-sans-semibold text-xs ${isDark ? "text-white" : "text-slate-800"}`}>
                        {appFee} ر.ي
                    </Text>
                </View>
                <View className={`mt-1 flex-row-reverse justify-between border-t pt-2 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <Text className="font-sans-bold text-sm text-main">
                        الإجمالي:
                    </Text>
                    <Text className="font-sans-bold text-sm text-main">
                        {totalFee} ر.ي
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default FeesSummary;
