import React, { memo } from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { BookingAppointmentFormValues } from "@/validation/appointments/schemas/booking-appointment.schema";

interface BookingNotesInputProps {
    control: Control<BookingAppointmentFormValues>;
    isDark: boolean;
}

const BookingNotesInput: React.FC<BookingNotesInputProps> = ({
    control,
    isDark,
}) => {
    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{ textAlign: "right" }}>
                ملاحظات ( اختياري )
            </Text>
            <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View
                        className={`w-full rounded-2xl border px-4 py-3 ${
                            isDark
                                ? "border-slate-700 bg-slate-900/60"
                                : "border-slate-200 bg-slate-50"
                        }`}>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="أكتب ملاحظات إضافية عن الحالة (مثل: أعاني من ألم...)"
                            placeholderTextColor={
                                isDark ? "#64748b" : "#94a3b8"
                            }
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            className={`font-sans-medium text-sm leading-6 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                            style={{
                                textAlign: "right",
                                minHeight: 80,
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default memo(BookingNotesInput);
