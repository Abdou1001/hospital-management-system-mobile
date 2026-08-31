import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useMyAppointments } from "@/hooks/appointments/useMyAppointments";
import { useThemeStore } from "@/store/theme.store";
import CardAppointments from "./CardAppointments";

type FilterStatus = "all" | "approved" | "pending" | "cancelled" | "rejected";

const filterOptions: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "approved", label: "مؤكدة" },
    { key: "pending", label: "قيد الانتظار" },
    { key: "cancelled", label: "ملغية" },
    { key: "rejected", label: "مرفوضة" },
];

const ShowAppointments = () => {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useMyAppointments();

    const appointments = useMemo(() => {
        const results = data?.results || [];
        if (selectedFilter === "all") {
            return results;
        }
        return results.filter((item) => item.status === selectedFilter);
    }, [data, selectedFilter]);

    return (
        <View className="flex-1 pb-10">
            {/* أزرار الفلترة حسب الحالة */}
            <View className="mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: "row-reverse",
                        gap: 8,
                        paddingHorizontal: 2,
                    }}>
                    {filterOptions.map((filter) => {
                        const isSelected = selectedFilter === filter.key;
                        return (
                            <Pressable
                                key={filter.key}
                                onPress={() => setSelectedFilter(filter.key)}
                                className={`rounded-2xl px-4 py-2 border ${
                                    isSelected
                                        ? "bg-main border-main shadow-sm"
                                        : isDark
                                          ? "bg-slate-800 border-slate-700"
                                          : "bg-white border-slate-200"
                                }`}>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        isSelected
                                            ? "text-white"
                                            : isDark
                                              ? "text-slate-300"
                                              : "text-slate-700"
                                    }`}>
                                    {filter.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* محتوى القائمة */}
            {isLoading ? (
                <View className="py-20 items-center justify-center">
                    <ActivityIndicator size="large" color="#10b981" />
                    <Text className="mt-3 font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        جارٍ تحميل حجوزاتك ومواعيدك...
                    </Text>
                </View>
            ) : isError ? (
                <View className="py-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-50/10 p-6">
                    <Ionicons
                        name="alert-circle-outline"
                        size={40}
                        color="#ef4444"
                    />
                    <Text className="mt-3 text-center font-sans-bold text-base text-red-500">
                        حدث خطأ أثناء جلب الحجوزات
                    </Text>
                    <Pressable
                        onPress={() => refetch()}
                        className="mt-4 rounded-xl bg-red-500 px-5 py-2.5">
                        <Text className="font-sans-bold text-xs text-white">
                            إعادة المحاولة
                        </Text>
                    </Pressable>
                </View>
            ) : appointments.length === 0 ? (
                /* حالة عدم وجود حجوزات */
                <View
                    className={`mt-4 items-center justify-center rounded-3xl border p-8 ${
                        isDark
                            ? "border-slate-800 bg-slate-800/60"
                            : "border-slate-100 bg-white"
                    }`}>
                    <View className="size-20 rounded-full bg-main/10 border-2 border-main/20 items-center justify-center mb-4">
                        <Ionicons
                            name="calendar-clear-outline"
                            size={36}
                            color="#10b981"
                        />
                    </View>
                    <Text
                        className={`text-center font-sans-bold text-lg ${
                            isDark ? "text-slate-100" : "text-slate-800"
                        }`}>
                        {selectedFilter === "all"
                            ? "لا توجد لديك حجوزات حتى الآن"
                            : "لا توجد حجوزات بهذه الحالة"}
                    </Text>
                    <Text className="mt-2 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 max-w-xs leading-5">
                        {selectedFilter === "all"
                            ? "يمكنك استعراض قائمة الأطباء واختيار الطبيب المناسب لحجز موعد جديد بكل سهولة."
                            : "يمكنك تغيير الفلتر لعرض جميع الحجوزات الأخرى."}
                    </Text>

                    {selectedFilter === "all" && (
                        <Pressable
                            onPress={() => router.push("/(tabs)/doctors")}
                            className="mt-5 rounded-2xl bg-main px-6 py-3 shadow-sm">
                            <Text className="font-sans-bold text-sm text-white">
                                تصفح الأطباء وحجز موعد
                            </Text>
                        </Pressable>
                    )}
                </View>
            ) : (
                /* قائمة الكروت */
                <View>
                    {appointments.map((appointment) => (
                        <CardAppointments
                            key={appointment.appointment_id}
                            appointment={appointment}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default ShowAppointments;
