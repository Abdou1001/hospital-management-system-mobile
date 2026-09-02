import CardDoctors from "@/components/doctors/CardDoctors";
import {groupDoctors} from "@/components/doctors/ShowDoctors";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import {icons} from "@/constants/icons";
import {useDoctors} from "@/hooks/doctors/useDoctors";
import {styled} from "nativewind";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Doctors = () => {
    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useDoctors();

    const rawList = data?.pages.flatMap((page) => page.results) ?? [];
    const groupedDoctors = groupDoctors(rawList);

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5 pb-20">
            <View className="mb-4">
                {/* الهيدر */}
                <UpperSection />

                {/* العنوان */}
                <SectionTitle title="قائمة الأطباء" icon={icons.doctors} />
            </View>
            <FlatList
                data={groupedDoctors}
                keyExtractor={(item) => String(item.doctor.doctor_id)}
                showsVerticalScrollIndicator={false}
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
                        <View className="py-20 items-center justify-center">
                            <ActivityIndicator size="large" color="#16a34a" />
                            <Text className="mt-3 font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                جارٍ تحميل قائمة الأطباء...
                            </Text>
                        </View>
                    ) : isError ? (
                        <View className="mt-4 items-center justify-center rounded-3xl border border-red-500/20 bg-red-50/10 p-6">
                            <Text className="text-center font-sans-bold text-base text-red-500">
                                حدث خطأ أثناء تحميل الأطباء
                            </Text>
                        </View>
                    ) : (
                        <View className="mt-4 items-center justify-center rounded-3xl border border-border bg-card px-6 py-8">
                            <Text className="mt-3 text-lg font-sans-bold text-primary">
                                لا يوجد أطباء
                            </Text>
                            <Text className="mt-1 text-center text-sm font-sans-medium text-muted-foreground">
                                لا يوجد أطباء متاحون حاليًا
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
