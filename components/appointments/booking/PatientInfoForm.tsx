import React, { memo } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { BookingAppointmentFormValues } from "@/validation/appointments/schemas/booking-appointment.schema";

interface PatientInfoFormProps {
    control: Control<BookingAppointmentFormValues>;
    errors: FieldErrors<BookingAppointmentFormValues>;
    isDark: boolean;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
    control,
    errors,
    isDark,
}) => {
    return (
        <>
            {/* ============================
                حقل اسم المريض
            ============================ */}
            <View className="mt-5">
                <Text
                    className={`mb-2 font-sans-bold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                    style={{ textAlign: "right" }}>
                    اسم المريض الكامل
                </Text>
                <Controller
                    control={control}
                    name="patient_name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View
                            className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                errors.patient_name
                                    ? "border-red-500 bg-red-50/20"
                                    : isDark
                                      ? "border-slate-700 bg-slate-900/60"
                                      : "border-slate-200 bg-slate-50"
                            }`}>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="أدخل الاسم الكامل للمريض"
                                placeholderTextColor={
                                    isDark ? "#64748b" : "#94a3b8"
                                }
                                className={`flex-1 font-sans-medium text-base ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}
                                style={{ textAlign: "right" }}
                            />
                        </View>
                    )}
                />
                {errors.patient_name?.message ? (
                    <Text
                        className="mt-1 font-sans-medium text-xs text-red-500"
                        style={{ textAlign: "right" }}>
                        {errors.patient_name.message}
                    </Text>
                ) : null}
            </View>

            {/* ============================
                حقل رقم الهاتف
            ============================ */}
            <View className="mt-4">
                <Text
                    className={`mb-2 font-sans-bold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                    style={{ textAlign: "right" }}>
                    رقم هاتف المريض
                </Text>
                <Controller
                    control={control}
                    name="patient_phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View
                            className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                errors.patient_phone
                                    ? "border-red-500 bg-red-50/20"
                                    : isDark
                                      ? "border-slate-700 bg-slate-900/60"
                                      : "border-slate-200 bg-slate-50"
                            }`}>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="7xxxxxxxx"
                                placeholderTextColor={
                                    isDark ? "#64748b" : "#94a3b8"
                                }
                                keyboardType="phone-pad"
                                className={`flex-1 font-sans-medium text-base ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}
                                style={{ textAlign: "right" }}
                            />
                        </View>
                    )}
                />
                {errors.patient_phone?.message ? (
                    <Text
                        className="mt-1 font-sans-medium text-xs text-red-500"
                        style={{ textAlign: "right" }}>
                        {errors.patient_phone.message}
                    </Text>
                ) : null}
            </View>

            {/* ============================
                العمر والجنس في صف واحد
            ============================ */}
            <View className="mt-4 flex-row-reverse gap-3">
                {/* العمر */}
                <View className="flex-1">
                    <Text
                        className={`mb-2 font-sans-bold text-sm ${
                            isDark ? "text-slate-200" : "text-slate-700"
                        }`}
                        style={{ textAlign: "right" }}>
                        العمر
                    </Text>
                    <Controller
                        control={control}
                        name="patient_age"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.patient_age
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="العمر"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    keyboardType="number-pad"
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                            </View>
                        )}
                    />
                    {errors.patient_age?.message ? (
                        <Text
                            className="mt-1 font-sans-medium text-xs text-red-500"
                            style={{ textAlign: "right" }}>
                            {errors.patient_age.message}
                        </Text>
                    ) : null}
                </View>

                {/* الجنس */}
                <View className="flex-1">
                    <Text
                        className={`mb-2 font-sans-bold text-sm ${
                            isDark ? "text-slate-200" : "text-slate-700"
                        }`}
                        style={{ textAlign: "right" }}>
                        الجنس
                    </Text>
                    <Controller
                        control={control}
                        name="patient_gender"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row-reverse gap-2">
                                {(["ذكر", "أنثى"] as const).map((g) => (
                                    <Pressable
                                        key={g}
                                        onPress={() => onChange(g)}
                                        className={`h-14 flex-1 items-center justify-center rounded-2xl border ${
                                            value === g
                                                ? "border-main bg-main/10"
                                                : isDark
                                                  ? "border-slate-700 bg-slate-900/60"
                                                  : "border-slate-200 bg-slate-50"
                                        }`}>
                                        <Text
                                            className={`font-sans-bold text-sm ${
                                                value === g
                                                    ? "text-main"
                                                    : isDark
                                                      ? "text-slate-300"
                                                      : "text-slate-600"
                                            }`}>
                                            {g}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    />
                    {errors.patient_gender?.message ? (
                        <Text
                            className="mt-1 font-sans-medium text-xs text-red-500"
                            style={{ textAlign: "right" }}>
                            {errors.patient_gender.message}
                        </Text>
                    ) : null}
                </View>
            </View>
        </>
    );
};

export default memo(PatientInfoForm);
