import CardAppointments from "@/components/appointments/CardAppointments";
import AppointmentReviewModal from "@/components/reception/AppointmentReviewModal";
import ReceptionHeader from "@/components/reception/ReceptionHeader";
import RejectConfirmationModal from "@/components/reception/RejectConfirmationModal";
import SearchBar from "@/components/shared/SearchBar";
import AppointmentCardSkeleton from "@/components/skeletons/AppointmentCardSkeleton";
import {usePendingAppointments} from "@/hooks/appointments/usePendingAppointments";
import {useDebounce} from "@/hooks/shared/useDebounce";
import {useThemeStore} from "@/store/theme.store";
import {Appointment} from "@/validation/appointments/schemas/appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import {styled} from "nativewind";
import {useCallback, useState} from "react";
import {FlatList, Keyboard, Pressable, RefreshControl, Text, TouchableWithoutFeedback, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function PendingAppointmentsScreen() {
    const {isDark} = useThemeStore();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const {
        pendingAppointments,
        count: totalPendingCount,
        isLoading,
        isError,
        refetch,
        isRefetching,
        acceptAppointment,
        rejectAppointment,
        isSubmitting,
    } = usePendingAppointments(debouncedSearch);

    // Modals state
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const handleAcceptAppointment = (adminNotes?: string) => {
        if (!selectedAppointment) return;
        acceptAppointment(
            selectedAppointment.appointment_id,
            adminNotes,
            () => {
                setSelectedAppointment(null);
            },
        );
    };

    const handleConfirmReject = (adminNotes: string) => {
        if (!selectedAppointment) return;
        rejectAppointment(
            selectedAppointment.appointment_id,
            adminNotes,
            () => {
                setIsRejectOpen(false);
                setSelectedAppointment(null);
            },
        );
    };

    const onRefresh = useCallback(() => {
        refetch();
    }, [refetch]);


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5 pb-20">
                {/* Separate Reception Header Component */}
                <ReceptionHeader />

                {/* Header / Info Badge */}
                <View className="mb-4">
                    <View className="flex-row-reverse items-center justify-between">
                        <View className="items-end">
                            <Text
                                className={`font-sans-bold text-xl ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                الحجوزات المعلقة
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                                الطلبات الجديدة بانتظار المراجعة والاعتماد
                            </Text>
                        </View>

                        {/* Pending Count Pill */}
                        <View className="flex-row-reverse items-center gap-1.5 my-3 rounded-full px-3 py-1 bg-amber-500/15 border border-amber-500/30">
                            <View className="size-2 rounded-full bg-amber-500" />
                            <Text className="font-sans-bold text-xs text-amber-700 dark:text-amber-300">
                                {totalPendingCount} معلقة
                            </Text>
                        </View>
                    </View>

                    {/* شريط البحث السريع */}
                    <SearchBar
                        placeholder={"ابحث باسم المريض..."}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        isLoading={isLoading}
                    />
                </View>

                {/* القائمة الرئيسية للحجوزات المعلقة */}
                <FlatList
                    data={pendingAppointments}
                    keyExtractor={(item) => String(item.appointment_id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 24,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={onRefresh}
                            colors={["#10b981"]}
                            tintColor="#10b981"
                        />
                    }
                    renderItem={({item}) => (
                        <CardAppointments
                            appointment={item}
                            onPress={() => setSelectedAppointment(item)}
                            actionArea={
                                <Pressable
                                    onPress={() => setSelectedAppointment(item)}
                                    className="w-full flex-row-reverse items-center justify-center gap-2 rounded-2xl bg-main py-2.5 active:opacity-85 shadow-xs">
                                    <Ionicons
                                        name="clipboard-outline"
                                        size={16}
                                        color="#ffffff"
                                    />
                                    <Text className="font-sans-bold text-xs text-white">
                                        مراجعة الطلب
                                    </Text>
                                </Pressable>
                            }
                        />
                    )}
                    ListEmptyComponent={
                        isLoading ? (
                            <AppointmentCardSkeleton count={4} />
                        ) : isError ? (
                            <View className="py-14 items-center justify-center rounded-3xl border border-red-500/20 bg-red-50/10 p-6">
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={40}
                                    color="#ef4444"
                                />
                                <Text className="mt-3 text-center font-sans-bold text-sm text-red-500">
                                    حدث خطأ أثناء تحميل الحجوزات المعلقة
                                </Text>
                                <Pressable
                                    onPress={() => refetch()}
                                    className="mt-4 rounded-xl bg-red-500 px-5 py-2">
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
                                        : "border-slate-100 bg-white shadow-xs"
                                }`}>
                                <View className="size-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 items-center justify-center mb-4">
                                    <Ionicons
                                        name="checkmark-done-circle-outline"
                                        size={38}
                                        color="#10b981"
                                    />
                                </View>
                                <Text
                                    className={`text-center font-sans-bold text-base ${
                                        isDark
                                            ? "text-slate-100"
                                            : "text-slate-800"
                                    }`}>
                                    {searchQuery.trim()
                                        ? `لا توجد نتائج مطابقة لـ "${searchQuery.trim()}"`
                                        : "لا توجد حجوزات معلقة حالياً"}
                                </Text>
                                <Text className="mt-1.5 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 leading-5">
                                    {searchQuery.trim()
                                        ? "جرب البحث باسم آخر أو إفراغ خانة البحث."
                                        : "جميع طلبات الحجز تمت مراجعتها بالكامل."}
                                </Text>
                            </View>
                        )
                    }
                />

                {/* نافذة مراجعة الحجز */}
                <AppointmentReviewModal
                    visible={!!selectedAppointment && !isRejectOpen}
                    onClose={() => setSelectedAppointment(null)}
                    appointment={selectedAppointment}
                    onAccept={handleAcceptAppointment}
                    onOpenReject={() => setIsRejectOpen(true)}
                    isSubmitting={isSubmitting}
                />

                {/* نافذة تأكيد الرفض مع سبب الرفض */}
                <RejectConfirmationModal
                    visible={isRejectOpen}
                    onClose={() => setIsRejectOpen(false)}
                    appointment={selectedAppointment}
                    onConfirmReject={handleConfirmReject}
                    isSubmitting={isSubmitting}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
