import CardDepartment from "@/components/departments/CardDepartment";
import {getDepartmentImageSource} from "@/components/departments/ShowDepartments";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import DepartmentCardSkeleton from "@/components/skeletons/DepartmentCardSkeleton";
import {icons} from "@/constants/icons";
import {useDepartments} from "@/hooks/departments/useDepartments";
import {useDebounce} from "@/hooks/shared/useDebounce";
import {useThemeStore} from "@/store/theme.store";
import {Department} from "@/validation/departments/schemas/department.schema";
import { Ionicons } from "@expo/vector-icons";
import {styled} from "nativewind";
import React, {useCallback, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Departments = () => {
    const {isDark} = useThemeStore();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 400);

    const queryParams = useMemo(() => {
        const trimmed = debouncedSearch.trim();
        return {
            limit: 12,
            ...(trimmed ? {keyword: trimmed} : {}),
        };
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
    } = useDepartments(queryParams);

    const departments: Department[] = useMemo(
        () => data?.pages.flatMap((page) => page.results) ?? [],
        [data],
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
                    placeholder="ابحث عن قسم طبي..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    isLoading={isFetching && !isLoading && !isFetchingNextPage}
                />

                {/* العنوان */}
                <SectionTitle title="الأقسام الطبية" icon={icons.departments} />
            </View>

            <FlatList
                data={departments}
                keyExtractor={(item, index) => String(item.depart_id ?? index)}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                renderItem={({item}) => (
                    <CardDepartment
                        id={item.depart_id}
                        name={item.depart_name}
                        image={getDepartmentImageSource(item)}
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
                        <View className="py-2">
                            <DepartmentCardSkeleton count={15} />
                        </View>
                    ) : isError ? (
                        <View className="py-16 items-center justify-center rounded-3xl border border-red-500/20 bg-red-50/10 p-6">
                            <Ionicons
                                name="alert-circle-outline"
                                size={40}
                                color="#ef4444"
                            />
                            <Text className="mt-3 text-center font-sans-bold text-base text-red-500">
                                حدث خطأ أثناء تحميل الأقسام
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
                            className={`mt-4 items-center justify-center rounded-3xl border ${isDark ? "border-white/50 bg-slate-800" : "border-border bg-card"} px-6 py-8`}>
                            <View className="size-20 rounded-full bg-main/10 border-2 border-main/20 items-center justify-center mb-4">
                                <Ionicons
                                    name="grid-outline"
                                    size={36}
                                    color="#10b981"
                                />
                            </View>
                            <Text
                                className={`mt-3 text-lg font-sans-bold ${isDark ? "text-white" : "text-primary"}`}>
                                {debouncedSearch.trim()
                                    ? `لا توجد نتائج مطابقة لـ "${debouncedSearch.trim()}"`
                                    : "لا توجد أقسام"}
                            </Text>
                            <Text
                                className={`mt-1 text-center text-sm font-sans-medium ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                                {debouncedSearch.trim()
                                    ? "تأكد من كتابة اسم القسم بشكل صحيح"
                                    : "لا توجد أقسام متاحة حاليًا"}
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

export default Departments;
