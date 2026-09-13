import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationEmptyState from "@/components/notifications/NotificationEmptyState";
import NotificationErrorState from "@/components/notifications/NotificationErrorState";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationCardSkeleton from "@/components/skeletons/NotificationCardSkeleton";
import {useNotifications} from "@/hooks/notifications/useNotifications";
import {useThemeStore} from "@/store/theme.store";
import {
    NotificationFilter,
    NotificationFilterOption,
} from "@/types/notifications.type";
import {styled} from "nativewind";
import {useCallback, useState} from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function NotificationsScreen() {
    const {isDark} = useThemeStore();
    const [selectedFilter, setSelectedFilter] =
        useState<NotificationFilter>("all");

    const {
        notifications,
        allNotifications,
        counts,
        unreadCount,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        markAsRead,
        markAllAsRead,
        isMarkingAll,
        deleteNotification,
        clearAllNotifications,
    } = useNotifications(selectedFilter);

    const filterOptions: NotificationFilterOption[] = [
        {key: "all", label: "الكل", count: counts.all},
        {key: "unread", label: "غير مقروءة", count: counts.unread},
        {key: "appointment", label: "المواعيد", count: counts.appointment},
        {key: "system", label: "النظام", count: counts.system},
    ];

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className="flex-1 bg-background dark:bg-slate-900 p-5">
            {/* Header Component */}
            <NotificationHeader
                unreadCount={unreadCount}
                totalCount={allNotifications.length}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAllNotifications}
                isMarkingAll={isMarkingAll}
            />

            {/* Filter Tabs / Pills */}
            <View className="mb-3">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: "row-reverse",
                        gap: 15,
                        paddingHorizontal: 2,
                    }}>
                    {filterOptions.map((filter) => {
                        const isSelected = selectedFilter === filter.key;
                        const badgeCount = filter.count ?? 0;

                        return (
                            <Pressable
                                key={filter.key}
                                onPress={() => setSelectedFilter(filter.key)}
                                className={`flex-row-reverse items-center justify-center gap-1.5 rounded-2xl min-w-[85px] p-3.5 py-3.5 border transition-all ${
                                    isSelected
                                        ? "bg-main border-main shadow-xs"
                                        : isDark
                                          ? "bg-slate-800 border-slate-700/80 active:bg-slate-750"
                                          : "bg-white border-slate-200 active:bg-slate-50"
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

                                {badgeCount > 0 && (
                                    <View
                                        className={`rounded-full px-1.5 py-0.2 items-center justify-center ${
                                            isSelected
                                                ? "bg-white/25"
                                                : isDark
                                                  ? "bg-slate-700"
                                                  : "bg-slate-100"
                                        }`}>
                                        <Text
                                            className={`font-sans-bold text-[10px] ${
                                                isSelected
                                                    ? "text-white"
                                                    : isDark
                                                      ? "text-slate-300"
                                                      : "text-slate-600"
                                            }`}>
                                            {badgeCount}
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 24,
                    flexGrow: 1,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={["#10b981"]}
                        tintColor="#10b981"
                    />
                }
                renderItem={({item}) => (
                    <NotificationCard
                        notification={item}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                    />
                )}
                ListEmptyComponent={
                    isLoading ? (
                        <View className="py-4">
                            <NotificationCardSkeleton count={5} />
                        </View>
                    ) : isError ? (
                        <NotificationErrorState
                            onRetry={() => refetch()}
                            isRetrying={isRefetching}
                            errorMessage={
                                error?.message ||
                                "حدث خطأ أثناء جلب قائمة الإشعارات. يرجى إعادة المحاولة."
                            }
                        />
                    ) : (
                        <NotificationEmptyState
                            filter={selectedFilter}
                            onResetFilter={() => setSelectedFilter("all")}
                        />
                    )
                }
            />
        </SafeAreaView>
    );
}
