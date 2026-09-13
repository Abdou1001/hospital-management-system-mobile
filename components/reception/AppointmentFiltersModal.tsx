import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExpandableModal from "@/components/ui/ExpandableModal";
import { useThemeStore } from "@/store/theme.store";
import { useDoctors } from "@/hooks/doctors/useDoctors";

export interface FilterState {
    status?: string;
    appointment_date?: string;
    from_date?: string;
    to_date?: string;
    patient_gender?: string;
    day_of_week?: string;
    doctor_id?: number | string;
    shift_type?: string;
}

interface AppointmentFiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: FilterState;
    onApplyFilters: (filters: FilterState) => void;
    onResetFilters: () => void;
}

const DAYS_OF_WEEK = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
];

const STATUS_OPTIONS = [
    { key: "", label: "كل الحالات" },
    { key: "pending", label: "معلقة" },
    { key: "approved", label: "مقبولة" },
    { key: "rejected", label: "مرفوضة" },
    { key: "cancelled", label: "ملغاة" },
];

function getTodayString(): string {
    const d = new Date();
    return d.toISOString().split("T")[0];
}

function getTomorrowString(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
}

function getWeekRange(): { from: string; to: string } {
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    return {
        from: now.toISOString().split("T")[0],
        to: end.toISOString().split("T")[0],
    };
}

const AppointmentFiltersModal: React.FC<AppointmentFiltersModalProps> = ({
    visible,
    onClose,
    filters,
    onApplyFilters,
    onResetFilters,
}) => {
    const { isDark } = useThemeStore();
    const { data: doctorsData } = useDoctors({ limit: 50 });

    const [tempFilters, setTempFilters] = useState<FilterState>(filters);
    const [dateMode, setDateMode] = useState<"none" | "today" | "tomorrow" | "week" | "custom">(
        () => {
            if (filters.appointment_date === getTodayString()) return "today";
            if (filters.appointment_date === getTomorrowString()) return "tomorrow";
            if (filters.from_date || filters.to_date) return "custom";
            return "none";
        }
    );

    const doctors = React.useMemo(() => {
        if (Array.isArray(doctorsData?.pages)) {
            return doctorsData.pages.flatMap((p: any) => p.results || []);
        }
        return [];
    }, [doctorsData]);

    const handleApply = () => {
        onApplyFilters(tempFilters);
        onClose();
    };

    const handleReset = () => {
        setTempFilters({});
        setDateMode("none");
        onResetFilters();
        onClose();
    };

    const selectDatePreset = (preset: "none" | "today" | "tomorrow" | "week" | "custom") => {
        setDateMode(preset);
        if (preset === "none") {
            setTempFilters((prev) => ({
                ...prev,
                appointment_date: undefined,
                from_date: undefined,
                to_date: undefined,
            }));
        } else if (preset === "today") {
            setTempFilters((prev) => ({
                ...prev,
                appointment_date: getTodayString(),
                from_date: undefined,
                to_date: undefined,
            }));
        } else if (preset === "tomorrow") {
            setTempFilters((prev) => ({
                ...prev,
                appointment_date: getTomorrowString(),
                from_date: undefined,
                to_date: undefined,
            }));
        } else if (preset === "week") {
            const range = getWeekRange();
            setTempFilters((prev) => ({
                ...prev,
                appointment_date: undefined,
                from_date: range.from,
                to_date: range.to,
            }));
        }
    };

    return (
        <ExpandableModal
            visible={visible}
            onClose={onClose}
            title="تصفية الحجوزات"
            subtitle="خصص نتائج البحث وفق المعايير المطلوبة"
            iconName="filter-outline"
            iconColor="#10b981"
            iconBgClass="bg-main/15">
            <View className="p-4 space-y-5">
                {/* 1. حالة الحجز */}
                <View>
                    <Text
                        className={`text-right font-sans-bold text-xs mb-2.5 ${
                            isDark ? "text-slate-200" : "text-slate-800"
                        }`}>
                        حالة الحجز:
                    </Text>
                    <View className="flex-row-reverse flex-wrap gap-2">
                        {STATUS_OPTIONS.map((opt) => {
                            const isSelected =
                                (tempFilters.status || "") === opt.key;
                            return (
                                <Pressable
                                    key={opt.key}
                                    onPress={() =>
                                        setTempFilters((prev) => ({
                                            ...prev,
                                            status: opt.key || undefined,
                                        }))
                                    }
                                    className={`rounded-xl px-3.5 py-2 border ${
                                        isSelected
                                            ? "bg-main border-main"
                                            : isDark
                                            ? "bg-slate-800 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}>
                                    <Text
                                        className={`font-sans-bold text-xs ${
                                            isSelected
                                                ? "text-white"
                                                : isDark
                                                ? "text-slate-300"
                                                : "text-slate-700"
                                        }`}>
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* 2. تاريخ الحجز */}
                <View className="mt-4">
                    <Text
                        className={`text-right font-sans-bold text-xs mb-2.5 ${
                            isDark ? "text-slate-200" : "text-slate-800"
                        }`}>
                        تاريخ الحجز:
                    </Text>
                    <View className="flex-row-reverse flex-wrap gap-2 mb-3">
                        {[
                            { key: "none", label: "كل الأوقات" },
                            { key: "today", label: "اليوم" },
                            { key: "tomorrow", label: "غداً" },
                            { key: "week", label: "خلال أسبوع" },
                            { key: "custom", label: "تاريخ مخصص" },
                        ].map((d) => (
                            <Pressable
                                key={d.key}
                                onPress={() => selectDatePreset(d.key as any)}
                                className={`rounded-xl px-3 py-1.5 border ${
                                    dateMode === d.key
                                        ? "bg-main border-main"
                                        : isDark
                                        ? "bg-slate-800 border-slate-700"
                                        : "bg-slate-50 border-slate-200"
                                }`}>
                                <Text
                                    className={`font-sans-medium text-xs ${
                                        dateMode === d.key
                                            ? "text-white"
                                            : isDark
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    {d.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* حقول تاريخ مخصص إذا اختار custom */}
                    {dateMode === "custom" && (
                        <View className="flex-row-reverse items-center gap-2 mt-1">
                            <View className="flex-1">
                                <Text
                                    className={`text-right font-sans-medium text-[11px] mb-1 ${
                                        isDark ? "text-slate-400" : "text-slate-500"
                                    }`}>
                                    من تاريخ:
                                </Text>
                                <TextInput
                                    value={tempFilters.from_date || ""}
                                    onChangeText={(v) =>
                                        setTempFilters((prev) => ({
                                            ...prev,
                                            from_date: v,
                                            appointment_date: undefined,
                                        }))
                                    }
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    className={`rounded-xl border px-3 py-2 text-center font-sans-medium text-xs ${
                                        isDark
                                            ? "bg-slate-800 border-slate-700 text-white"
                                            : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className={`text-right font-sans-medium text-[11px] mb-1 ${
                                        isDark ? "text-slate-400" : "text-slate-500"
                                    }`}>
                                    إلى تاريخ:
                                </Text>
                                <TextInput
                                    value={tempFilters.to_date || ""}
                                    onChangeText={(v) =>
                                        setTempFilters((prev) => ({
                                            ...prev,
                                            to_date: v,
                                            appointment_date: undefined,
                                        }))
                                    }
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    className={`rounded-xl border px-3 py-2 text-center font-sans-medium text-xs ${
                                        isDark
                                            ? "bg-slate-800 border-slate-700 text-white"
                                            : "bg-slate-50 border-slate-200 text-slate-900"
                                    }`}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* 3. جنس المريض */}
                <View className="mt-4">
                    <Text
                        className={`text-right font-sans-bold text-xs mb-2.5 ${
                            isDark ? "text-slate-200" : "text-slate-800"
                        }`}>
                        جنس المريض:
                    </Text>
                    <View className="flex-row-reverse gap-2">
                        {[
                            { key: "", label: "الكل" },
                            { key: "ذكر", label: "ذكر" },
                            { key: "أنثى", label: "أنثى" },
                        ].map((g) => {
                            const isSelected =
                                (tempFilters.patient_gender || "") === g.key;
                            return (
                                <Pressable
                                    key={g.key}
                                    onPress={() =>
                                        setTempFilters((prev) => ({
                                            ...prev,
                                            patient_gender: g.key || undefined,
                                        }))
                                    }
                                    className={`flex-1 items-center justify-center rounded-xl py-2 border ${
                                        isSelected
                                            ? "bg-main border-main"
                                            : isDark
                                            ? "bg-slate-800 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}>
                                    <Text
                                        className={`font-sans-bold text-xs ${
                                            isSelected
                                                ? "text-white"
                                                : isDark
                                                ? "text-slate-300"
                                                : "text-slate-700"
                                        }`}>
                                        {g.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* 4. اليوم من الأسبوع */}
                <View className="mt-4">
                    <Text
                        className={`text-right font-sans-bold text-xs mb-2.5 ${
                            isDark ? "text-slate-200" : "text-slate-800"
                        }`}>
                        يوم الدوام:
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row-reverse",
                            gap: 8,
                        }}>
                        <Pressable
                            onPress={() =>
                                setTempFilters((prev) => ({
                                    ...prev,
                                    day_of_week: undefined,
                                }))
                            }
                            className={`rounded-xl px-3 py-1.5 border ${
                                !tempFilters.day_of_week
                                    ? "bg-main border-main"
                                    : isDark
                                    ? "bg-slate-800 border-slate-700"
                                    : "bg-slate-50 border-slate-200"
                            }`}>
                            <Text
                                className={`font-sans-medium text-xs ${
                                    !tempFilters.day_of_week
                                        ? "text-white"
                                        : isDark
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                كل الأيام
                            </Text>
                        </Pressable>
                        {DAYS_OF_WEEK.map((day) => {
                            const isSelected = tempFilters.day_of_week === day;
                            return (
                                <Pressable
                                    key={day}
                                    onPress={() =>
                                        setTempFilters((prev) => ({
                                            ...prev,
                                            day_of_week: isSelected
                                                ? undefined
                                                : day,
                                        }))
                                    }
                                    className={`rounded-xl px-3 py-1.5 border ${
                                        isSelected
                                            ? "bg-main border-main"
                                            : isDark
                                            ? "bg-slate-800 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}>
                                    <Text
                                        className={`font-sans-medium text-xs ${
                                            isSelected
                                                ? "text-white"
                                                : isDark
                                                ? "text-slate-300"
                                                : "text-slate-700"
                                        }`}>
                                        {day}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* 5. الطبيب */}
                {doctors.length > 0 && (
                    <View className="mt-4">
                        <Text
                            className={`text-right font-sans-bold text-xs mb-2.5 ${
                                isDark ? "text-slate-200" : "text-slate-800"
                            }`}>
                            الطبيب المعالج:
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: "row-reverse",
                                gap: 8,
                            }}>
                            <Pressable
                                onPress={() =>
                                    setTempFilters((prev) => ({
                                        ...prev,
                                        doctor_id: undefined,
                                    }))
                                }
                                className={`rounded-xl px-3 py-1.5 border ${
                                    !tempFilters.doctor_id
                                        ? "bg-main border-main"
                                        : isDark
                                        ? "bg-slate-800 border-slate-700"
                                        : "bg-slate-50 border-slate-200"
                                }`}>
                                <Text
                                    className={`font-sans-medium text-xs ${
                                        !tempFilters.doctor_id
                                            ? "text-white"
                                            : isDark
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    كل الأطباء
                                </Text>
                            </Pressable>
                            {doctors.map((doc: any) => {
                                const isSelected =
                                    String(tempFilters.doctor_id) ===
                                    String(doc.doctor_id || doc.id);
                                return (
                                    <Pressable
                                        key={doc.doctor_id || doc.id}
                                        onPress={() =>
                                            setTempFilters((prev) => ({
                                                ...prev,
                                                doctor_id: isSelected
                                                    ? undefined
                                                    : doc.doctor_id || doc.id,
                                            }))
                                        }
                                        className={`rounded-xl px-3 py-1.5 border ${
                                            isSelected
                                                ? "bg-main border-main"
                                                : isDark
                                                ? "bg-slate-800 border-slate-700"
                                                : "bg-slate-50 border-slate-200"
                                        }`}>
                                        <Text
                                            className={`font-sans-medium text-xs ${
                                                isSelected
                                                    ? "text-white"
                                                    : isDark
                                                    ? "text-slate-300"
                                                    : "text-slate-700"
                                            }`}>
                                            {doc.full_name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* أزرار الإجراء: تطبيق / إعادة تعيين */}
                <View className="mt-6 flex-row-reverse items-center gap-3">
                    <Pressable
                        onPress={handleApply}
                        className="flex-1 items-center justify-center rounded-2xl py-3.5 bg-main active:opacity-85 shadow-xs">
                        <Text className="font-sans-bold text-sm text-white">
                            تطبيق الفلاتر
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleReset}
                        className={`px-5 py-3.5 rounded-2xl border ${
                            isDark
                                ? "border-slate-700 bg-slate-800 active:bg-slate-750"
                                : "border-slate-200 bg-white active:bg-slate-100"
                        }`}>
                        <Text
                            className={`font-sans-medium text-sm ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                            إعادة تعيين
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ExpandableModal>
    );
};

export default AppointmentFiltersModal;
