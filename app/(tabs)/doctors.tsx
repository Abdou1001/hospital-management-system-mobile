import CardDoctors from "@/components/doctors/CardDoctors";
import DoctorCardSkeleton from "@/components/skeletons/DoctorCardSkeleton";
import { groupDoctors } from "@/components/doctors/ShowDoctors";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { useDoctors } from "@/hooks/doctors/useDoctors";
import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/theme.store";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

const SafeAreaView = styled(RNSafeAreaView);

const Doctors = () => {
    const {isDark} = useThemeStore();
    const params = useLocalSearchParams<{ keyword?: string }>();
    const [searchQuery, setSearchQuery] = useState(params.keyword || "");
    const debouncedSearch = useDebounce(searchQuery, 500);

    // مزامنة نص البحث عند الانتقال من شاشة أخرى (مثل الرئيسية)
    useEffect(() => {
        if (params.keyword !== undefined) {
            setSearchQuery(params.keyword);
        }
    }, [params.keyword]);

    const queryParams = useMemo(() => {
        const trimmed = debouncedSearch.trim();
        return trimmed ? { keyword: trimmed } : undefined;
    }, [debouncedSearch]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
        isRefetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useDoctors(queryParams);

    const rawList = useMemo(
        () => data?.pages.flatMap((page) => page.results) ?? [],
        [data]
    );

    const groupedDoctors = useMemo(
        () => groupDoctors(rawList),
        [rawList]
    );

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5 pb-20">
            <View className="mb-4">
                {/* الهيدر والبحث */}
                <UpperSection
                    placeholder="ابحث عن طبيبك بالاسم أو التخصص..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    isLoading={isFetching && !isLoading && !isFetchingNextPage}
                />

                {/* العنوان */}
                <SectionTitle title="قائمة الأطباء" icon={icons.doctors} />
            </View>

            <FlatList
                data={groupedDoctors}
                keyExtractor={(item) => String(item.doctor.doctor_id)}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ItemSeparatorComponent={() => <View className="h-4" />}
                renderItem={({item}) => (
                    <CardDoctors
                        doctor={item.doctor}
                        departments={item.departments}
                    />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={["#16a34a"]}
                        tintColor="#16a34a"
                    />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <DoctorCardSkeleton count={4} />
                    ) : isError ? (
                        <View className="py-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-50/10 p-6">
                            <Ionicons
                                name="alert-circle-outline"
                                size={40}
                                color="#ef4444"
                            />
                            <Text className="mt-3 text-center font-sans-bold text-base text-red-500">
                                حدث خطأ أثناء تحميل الأطباء
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
                            className={`mt-4 items-center justify-center rounded-3xl border ${isDark ? "border-white/50 bg-slate-800 text-white" : "border-border bg-card"} px-6 py-8`}>
                            <View className="size-20 rounded-full bg-main/10 border-2 border-main/20 items-center justify-center mb-4">
                                <Ionicons
                                    name="person-outline"
                                    size={36}
                                    color="#10b981"
                                />
                            </View>
                            <Text
                                className={`mt-3 text-lg font-sans-bold ${isDark ? "text-white" : "text-primary"}`}>
                                {debouncedSearch.trim()
                                    ? `لا توجد نتائج مطابقة لـ "${debouncedSearch.trim()}"`
                                    : "لا يوجد أطباء"}
                            </Text>
                            <Text
                                className={`mt-1 text-center text-sm font-sans-medium ${isDark ? "text-gray-400" : "text-muted-foreground"}`}>
                                {debouncedSearch.trim()
                                    ? "تأكد من كتابة اسم الطبيب أو التخصص بشكل صحيح"
                                    : "لا يوجد أطباء متاحون حاليًا"}
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4 items-center justify-center">
                            <ActivityIndicator size="small" color="#16a34a" />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

export default Doctors;
