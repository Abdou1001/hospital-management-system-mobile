import { useMyAppointments } from "@/hooks/appointments/useMyAppointments";
import { useThemeStore } from "@/store/theme.store";
import { Appointment } from "@/validation/appointments/schemas/appointment.schema";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import CardAppointments from "./CardAppointments";

type FilterStatus = "all" | "approved" | "pending" | "cancelled" | "rejected";

const filterOptions: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "approved", label: "مؤكدة" },
    { key: "pending", label: "قيد الانتظار" },
    { key: "cancelled", label: "ملغية" },
    { key: "rejected", label: "مرفوضة" },
];

interface ShowAppointmentsProps {
    keyword?: string;
}

const ShowAppointments: React.FC<ShowAppointmentsProps> = ({ keyword }) => {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");

    const queryFilter = useMemo(() => {
        const trimmed = keyword?.trim();
        const filterObj: any = {};
        if (selectedFilter !== "all") {
            filterObj.status = selectedFilter;
        }
        if (trimmed) {
            filterObj.keyword = trimmed;
        }
        return Object.keys(filterObj).length > 0 ? filterObj : undefined;
    }, [selectedFilter, keyword]);

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useMyAppointments(queryFilter);

    const appointments: Appointment[] = useMemo(() => {
        const results = data?.pages.flatMap((page) => page.results) ?? [];
        if (selectedFilter === "all") {
            return results;
        }
        return results.filter((item) => item.status === selectedFilter);
    }, [data, selectedFilter]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <View className="flex-1">
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

            {/* الحجوزات */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => String(item.appointment_id)}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                renderItem={({ item }) => (
                    <CardAppointments appointment={item} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={["#10b981"]}
                        tintColor="#10b981"
                    />
                }
                ListEmptyComponent={
                    isLoading ? (
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
                    ) : (
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
                                {keyword?.trim()
                                    ? `لا توجد نتائج مطابقة لـ "${keyword.trim()}"`
                                    : selectedFilter === "all"
                                      ? "لا توجد لديك حجوزات حتى الآن"
                                      : "لا توجد حجوزات بهذه الحالة"}
                            </Text>
                            <Text className="mt-2 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 max-w-xs leading-5">
                                {keyword?.trim()
                                    ? "تأكد من كتابة اسم الطبيب أو اسم المريض بشكل صحيح"
                                    : selectedFilter === "all"
                                      ? "يمكنك استعراض قائمة الأطباء واختيار الطبيب المناسب لحجز موعد جديد بكل سهولة."
                                      : "يمكنك تغيير الفلتر لعرض جميع الحجوزات الأخرى."}
                            </Text>

                            {selectedFilter === "all" && !keyword?.trim() && (
                                <Pressable
                                    onPress={() =>
                                        router.push("/(tabs)/doctors")
                                    }
                                    className="mt-5 rounded-2xl bg-main px-6 py-3 shadow-sm">
                                    <Text className="font-sans-bold text-sm text-white">
                                        تصفح الأطباء وحجز موعد
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4 items-center justify-center">
                            <ActivityIndicator size="small" color="#10b981" />
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default memo(ShowAppointments);
