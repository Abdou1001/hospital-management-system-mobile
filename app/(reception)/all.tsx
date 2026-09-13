import CardAppointments from "@/components/appointments/CardAppointments";
import AppointmentFiltersModal, {
    FilterState,
} from "@/components/reception/AppointmentFiltersModal";
import AppointmentReviewModal from "@/components/reception/AppointmentReviewModal";
import ReceptionHeader from "@/components/reception/ReceptionHeader";
import RejectConfirmationModal from "@/components/reception/RejectConfirmationModal";
import SearchBar from "@/components/shared/SearchBar";
import AppointmentCardSkeleton from "@/components/skeletons/AppointmentCardSkeleton";
import {useAppointments} from "@/hooks/appointments/useAppointments";
import {usePendingAppointments} from "@/hooks/appointments/usePendingAppointments";
import {useDebounce} from "@/hooks/shared/useDebounce";
import {useThemeStore} from "@/store/theme.store";
import {Appointment} from "@/validation/appointments/schemas/appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import {styled} from "nativewind";
import {useCallback, useMemo, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export interface AllAppointmentsFilterValues {
    keyword: string;
    status: string;
    appointment_date?: string;
    from_date?: string;
    to_date?: string;
    patient_gender?: string;
    day_of_week?: string;
    doctor_id?: string | number;
}

const QUICK_STATUS_TABS = [
    {key: "", label: "الكل"},
    {key: "pending", label: "معلقة"},
    {key: "approved", label: "مقبولة"},
    {key: "rejected", label: "مرفوضة"},
    {key: "cancelled", label: "ملغاة"},
];

export default function AllAppointmentsScreen() {
    const {isDark} = useThemeStore();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Modals state for reviewing pending items if clicked
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    // Using React Hook Form for filters and search management
    const {control, watch, setValue, reset} =
        useForm<AllAppointmentsFilterValues>({
            defaultValues: {
                keyword: "",
                status: "",
                appointment_date: undefined,
                from_date: undefined,
                to_date: undefined,
                patient_gender: undefined,
                day_of_week: undefined,
                doctor_id: undefined,
            },
        });

    const formValues = watch();
    const debouncedKeyword = useDebounce(formValues.keyword, 350);

    const {acceptAppointment, rejectAppointment, isSubmitting} =
        usePendingAppointments();

    // Query parameters built from React Hook Form values + debounced keyword
    const queryParams = useMemo(() => {
        const p: any = {
            limit: 15,
            status: formValues.status || undefined,
            appointment_date: formValues.appointment_date || undefined,
            from_date: formValues.from_date || undefined,
            to_date: formValues.to_date || undefined,
            patient_gender: formValues.patient_gender || undefined,
            day_of_week: formValues.day_of_week || undefined,
            doctor_id: formValues.doctor_id || undefined,
        };
        if (debouncedKeyword?.trim()) {
            p.keyword = debouncedKeyword.trim();
        }
        return p;
    }, [formValues, debouncedKeyword]);

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useAppointments(queryParams);

    const appointments: Appointment[] = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.results || []);
    }, [data]);

    const activeFilterCount = useMemo(() => {
        let c = 0;
        if (
            formValues.appointment_date ||
            formValues.from_date ||
            formValues.to_date
        )
            c++;
        if (formValues.doctor_id) c++;
        if (formValues.patient_gender) c++;
        if (formValues.day_of_week) c++;
        return c;
    }, [formValues]);

    const handleQuickStatusChange = (statusKey: string) => {
        setValue("status", statusKey);
    };

    const handleApplyModalFilters = (newFilters: FilterState) => {
        setValue("appointment_date", newFilters.appointment_date);
        setValue("from_date", newFilters.from_date);
        setValue("to_date", newFilters.to_date);
        setValue("patient_gender", newFilters.patient_gender);
        setValue("day_of_week", newFilters.day_of_week);
        setValue("doctor_id", newFilters.doctor_id);
        if (newFilters.status !== undefined) {
            setValue("status", newFilters.status);
        }
    };

    const handleResetModalFilters = () => {
        reset({
            keyword: formValues.keyword,
            status: formValues.status,
            appointment_date: undefined,
            from_date: undefined,
            to_date: undefined,
            patient_gender: undefined,
            day_of_week: undefined,
            doctor_id: undefined,
        });
    };

    const handleAcceptAppointment = (adminNotes?: string) => {
        if (!selectedAppointment) return;
        acceptAppointment(
            selectedAppointment.appointment_id,
            adminNotes,
            () => {
                setSelectedAppointment(null);
                refetch();
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
                refetch();
            },
        );
    };

    const onRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const onEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-4 pb-20">
            {/* Separate Reception Header Component */}
            <ReceptionHeader />

            {/* Header / Search & Filter Actions */}
            <View className="mb-3">
                <View className="flex-row-reverse items-center justify-between">
                    <View className="items-end">
                        <Text
                            className={`font-sans-bold text-xl ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                            جميع الحجوزات
                        </Text>
                        <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                            سجل الحجوزات الكامل في المستشفى
                        </Text>
                    </View>

                    {/* زر الفلاتر المتقدمة */}
                    <Pressable
                        onPress={() => setIsFilterModalOpen(true)}
                        hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
                        className={`flex-row-reverse items-center gap-1.5 rounded-2xl px-3.5 py-2 border relative ${
                            activeFilterCount > 0
                                ? "bg-main/15 border-main"
                                : isDark
                                  ? "bg-slate-800 border-slate-700 active:bg-slate-750"
                                  : "bg-white border-slate-200 active:bg-slate-100 shadow-xs"
                        }`}>
                        <Ionicons
                            name="options-outline"
                            size={16}
                            color={
                                activeFilterCount > 0
                                    ? "#10b981"
                                    : isDark
                                      ? "#94a3b8"
                                      : "#64748b"
                            }
                        />
                        <Text
                            className={`font-sans-bold text-xs ${
                                activeFilterCount > 0
                                    ? "text-main dark:text-emerald-400"
                                    : isDark
                                      ? "text-slate-200"
                                      : "text-slate-700"
                            }`}>
                            الفلاتر
                        </Text>

                        {activeFilterCount > 0 && (
                            <View className="size-2 rounded-full bg-main absolute -top-0.5 -right-0.5" />
                        )}
                    </Pressable>
                </View>

                {/* شريط البحث باستخدام React Hook Form Controller */}
                <Controller
                    control={control}
                    name="keyword"
                    render={({field: {value, onChange}}) => (
                        <SearchBar
                            placeholder={"ابحث باسم المريض أو رقم الهاتف..."}
                            value={value}
                            onChangeText={onChange}
                            isLoading={isLoading}
                        />
                    )}
                />

                {/* شريط تبويب سريع للحالات (Quick Status Tabs) */}
                <View className="mt-3">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row-reverse",
                            gap: 16,
                        }}>
                        {QUICK_STATUS_TABS.map((tab) => {
                            const isSelected =
                                (formValues.status || "") === tab.key;
                            return (
                                <Pressable
                                    key={tab.key}
                                    onPress={() =>
                                        handleQuickStatusChange(tab.key)
                                    }
                                    className={`rounded-2xl px-4.5 py-2.5 border ${
                                        isSelected
                                            ? "bg-main border-main shadow-xs"
                                            : isDark
                                              ? "bg-slate-800 border-slate-700/80 active:bg-slate-750"
                                              : "bg-white border-slate-200 active:bg-slate-50 shadow-xs"
                                    }`}>
                                    <Text
                                        className={`font-sans-bold text-xs ${
                                            isSelected
                                                ? "text-white"
                                                : isDark
                                                  ? "text-slate-300"
                                                  : "text-slate-700"
                                        }`}>
                                        {tab.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>

            {/* قائمة الحجوزات */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => String(item.appointment_id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 24,
                }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.4}
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
                        onPress={() => {
                            if (item.status === "pending") {
                                setSelectedAppointment(item);
                            }
                        }}
                        actionArea={
                            item.status === "pending" ? (
                                <Pressable
                                    onPress={() => setSelectedAppointment(item)}
                                    className="w-full flex-row-reverse items-center justify-center gap-2 rounded-2xl bg-main py-2.5 active:opacity-85 shadow-xs">
                                    <Ionicons
                                        name="clipboard-outline"
                                        size={16}
                                        color="#ffffff"
                                    />
                                    <Text className="font-sans-bold text-xs text-white">
                                        مراجعة هذا الطلب
                                    </Text>
                                </Pressable>
                            ) : null
                        }
                    />
                )}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4 items-center justify-center">
                            <ActivityIndicator size="small" color="#10b981" />
                        </View>
                    ) : null
                }
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
                                حدث خطأ أثناء جلب الحجوزات
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
                            <View className="size-20 rounded-full bg-main/10 border-2 border-main/20 items-center justify-center mb-4">
                                <Ionicons
                                    name="calendar-outline"
                                    size={36}
                                    color="#10b981"
                                />
                            </View>
                            <Text
                                className={`text-center font-sans-bold text-base ${
                                    isDark ? "text-slate-100" : "text-slate-800"
                                }`}>
                                لا توجد نتائج مطابقة
                            </Text>
                            <Text className="mt-1.5 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 leading-5">
                                جرب تغيير كلمة البحث أو إعادة تعيين الفلاتر.
                            </Text>
                        </View>
                    )
                }
            />

            {/* نافذة الفلاتر المتقدمة */}
            <AppointmentFiltersModal
                visible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={{
                    status: formValues.status,
                    appointment_date: formValues.appointment_date,
                    from_date: formValues.from_date,
                    to_date: formValues.to_date,
                    patient_gender: formValues.patient_gender,
                    day_of_week: formValues.day_of_week,
                    doctor_id: formValues.doctor_id,
                }}
                onApplyFilters={handleApplyModalFilters}
                onResetFilters={handleResetModalFilters}
            />

            {/* نافذة مراجعة الحجز إن وجد حجز معلق */}
            <AppointmentReviewModal
                visible={!!selectedAppointment && !isRejectOpen}
                onClose={() => setSelectedAppointment(null)}
                appointment={selectedAppointment}
                onAccept={handleAcceptAppointment}
                onOpenReject={() => setIsRejectOpen(true)}
                isSubmitting={isSubmitting}
            />

            {/* نافذة تأكيد الرفض */}
            <RejectConfirmationModal
                visible={isRejectOpen}
                onClose={() => setIsRejectOpen(false)}
                appointment={selectedAppointment}
                onConfirmReject={handleConfirmReject}
                isSubmitting={isSubmitting}
            />
        </SafeAreaView>
    );
}
