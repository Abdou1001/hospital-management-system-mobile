import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useThemeStore } from "@/store/theme.store";

interface DatePickerInputProps {
    value?: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    minYear?: number;
    maxYear?: number;
}

const MONTHS_AR = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
];

const DAYS_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
    value,
    onChange,
    label,
    placeholder = "اختر التاريخ",
    error,
    minYear = 1940,
    maxYear = new Date().getFullYear(),
}) => {
    const { isDark } = useThemeStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [showYearSelector, setShowYearSelector] = useState(false);

    // التحليل المبدئي للتاريخ المختارات
    const initialDate = useMemo(() => {
        if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date(2000, 0, 1);
    }, [value]);

    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

    const handleOpenModal = () => {
        if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split("-").map(Number);
            setSelectedYear(y);
            setSelectedMonth(m - 1);
            setSelectedDay(d);
        }
        setModalVisible(true);
    };

    // حاسبة أيام الشهر
    const daysInMonth = useMemo(() => {
        return new Date(selectedYear, selectedMonth + 1, 0).getDate();
    }, [selectedYear, selectedMonth]);

    const firstDayOfWeek = useMemo(() => {
        return new Date(selectedYear, selectedMonth, 1).getDay();
    }, [selectedYear, selectedMonth]);

    const handlePrevMonth = () => {
        if (selectedMonth === 0) {
            if (selectedYear > minYear) {
                setSelectedYear(selectedYear - 1);
                setSelectedMonth(11);
            }
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            if (selectedYear < maxYear) {
                setSelectedYear(selectedYear + 1);
                setSelectedMonth(0);
            }
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const handleConfirm = () => {
        const mStr = String(selectedMonth + 1).padStart(2, "0");
        const dStr = String(selectedDay).padStart(2, "0");
        const dateStr = `${selectedYear}-${mStr}-${dStr}`;
        onChange(dateStr);
        setModalVisible(false);
    };

    // قائمة السنوات لسرعة الاختيار
    const yearsList = useMemo(() => {
        const list = [];
        for (let y = maxYear; y >= minYear; y--) {
            list.push(y);
        }
        return list;
    }, [minYear, maxYear]);

    return (
        <View className="w-full">
            {label ? (
                <Text
                    className={`mb-2 font-sans-bold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                    style={{ textAlign: "right" }}>
                    {label}
                </Text>
            ) : null}

            {/* زر فتح المودال */}
            <Pressable
                onPress={handleOpenModal}
                className={`h-14 w-full flex-row-reverse items-center justify-between rounded-2xl border px-4 ${
                    error
                        ? "border-red-500 bg-red-50/20"
                        : isDark
                          ? "border-slate-700 bg-slate-900/60"
                          : "border-slate-200 bg-slate-50"
                }`}>
                <Text
                    className={`font-sans-medium text-base ${
                        value
                            ? isDark
                                ? "text-white"
                                : "text-slate-900"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                    }`}>
                    {value || placeholder}
                </Text>
                <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={isDark ? "#94a3b8" : "#64748b"}
                />
            </Pressable>

            {error ? (
                <Text
                    className="mt-1 font-sans-medium text-xs text-red-500"
                    style={{ textAlign: "right" }}>
                    {error}
                </Text>
            ) : null}

            {/* مودال التقويم العائم */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 items-center justify-center bg-black/60 px-5">
                    <View
                        className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${
                            isDark
                                ? "border-slate-800 bg-slate-900"
                                : "border-slate-100 bg-white"
                        }`}>
                        {/* الهيدر العلوي للمودال */}
                        <View className="mb-4 flex-row-reverse items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                            <Text className="font-sans-bold text-lg text-main">
                                اختر التاريخ
                            </Text>
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={isDark ? "#94a3b8" : "#64748b"}
                                />
                            </Pressable>
                        </View>

                        {/* اختيار السنة والشهر */}
                        <View className="mb-4 flex-row-reverse items-center justify-between px-2">
                            <Pressable
                                onPress={() => setShowYearSelector(!showYearSelector)}
                                className="flex-row-reverse items-center gap-1 bg-main/10 px-3 py-1.5 rounded-xl border border-main/20">
                                <Text className="font-sans-bold text-base text-main">
                                    {MONTHS_AR[selectedMonth]} {selectedYear}
                                </Text>
                                <Ionicons
                                    name={showYearSelector ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color="#10b981"
                                />
                            </Pressable>

                            {!showYearSelector && (
                                <View className="flex-row items-center gap-2">
                                    <Pressable
                                        onPress={handleNextMonth}
                                        className="size-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                        <Ionicons
                                            name="chevron-forward"
                                            size={18}
                                            color={isDark ? "#ffffff" : "#1e293b"}
                                        />
                                    </Pressable>
                                    <Pressable
                                        onPress={handlePrevMonth}
                                        className="size-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                        <Ionicons
                                            name="chevron-back"
                                            size={18}
                                            color={isDark ? "#ffffff" : "#1e293b"}
                                        />
                                    </Pressable>
                                </View>
                            )}
                        </View>

                        {/* قائمة السنوات السريعة */}
                        {showYearSelector ? (
                            <View className="h-64 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-2">
                                <ScrollView showsVerticalScrollIndicator>
                                    <View className="flex-row flex-wrap justify-center gap-2 py-1">
                                        {yearsList.map((y) => (
                                            <Pressable
                                                key={y}
                                                onPress={() => {
                                                    setSelectedYear(y);
                                                    setShowYearSelector(false);
                                                }}
                                                className={`px-4 py-2 rounded-xl border ${
                                                    selectedYear === y
                                                        ? "bg-main border-main shadow"
                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                }`}>
                                                <Text
                                                    className={`font-sans-bold text-sm ${
                                                        selectedYear === y
                                                            ? "text-white"
                                                            : isDark
                                                              ? "text-slate-200"
                                                              : "text-slate-800"
                                                    }`}>
                                                    {y}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (
                            /* شبكة أيام الشهر */
                            <View>
                                {/* أسماء أيام الأسبوع */}
                                <View className="flex-row-reverse justify-between mb-2 px-1">
                                    {DAYS_AR.map((day, idx) => (
                                        <View key={idx} className="w-9 items-center">
                                            <Text className="font-sans-bold text-xs text-slate-400">
                                                {day}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* أيام الشهر */}
                                <View className="flex-row-reverse flex-wrap">
                                    {/* فراغات بداية الشهر */}
                                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                                        <View key={`empty-${idx}`} className="w-9 h-9 my-0.5" />
                                    ))}

                                    {/* الأيام الفعلية */}
                                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                                        const dayNum = idx + 1;
                                        const isSelected = selectedDay === dayNum;

                                        return (
                                            <View key={dayNum} className="w-9 my-0.5 items-center">
                                                <Pressable
                                                    onPress={() => setSelectedDay(dayNum)}
                                                    className={`size-9 items-center justify-center rounded-xl ${
                                                        isSelected
                                                            ? "bg-main shadow-md"
                                                            : "bg-transparent"
                                                    }`}>
                                                    <Text
                                                        className={`font-sans-bold text-sm ${
                                                            isSelected
                                                                ? "text-white"
                                                                : isDark
                                                                  ? "text-slate-200"
                                                                  : "text-slate-800"
                                                        }`}>
                                                        {dayNum}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* أزرار الإجراءات */}
                        <View className="mt-5 flex-row-reverse gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Pressable
                                onPress={handleConfirm}
                                className="flex-1 h-12 items-center justify-center rounded-xl bg-main shadow">
                                <Text className="font-sans-bold text-sm text-white">
                                    تأكيد الاختيار
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="h-12 px-5 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                <Text className="font-sans-bold text-sm text-slate-600 dark:text-slate-400">
                                    إلغاء
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePickerInput;
