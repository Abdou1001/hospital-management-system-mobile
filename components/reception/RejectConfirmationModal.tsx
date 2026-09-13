import React, { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExpandableModal from "@/components/ui/ExpandableModal";
import { useThemeStore } from "@/store/theme.store";
import { Appointment } from "@/validation/appointments/schemas/appointment.schema";

interface RejectConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onConfirmReject: (adminNotes: string) => void;
    isSubmitting: boolean;
}

const RejectConfirmationModal: React.FC<RejectConfirmationModalProps> = ({
    visible,
    onClose,
    appointment,
    onConfirmReject,
    isSubmitting,
}) => {
    const { isDark } = useThemeStore();
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        onConfirmReject(reason.trim());
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setReason("");
            onClose();
        }
    };

    if (!appointment) return null;

    return (
        <ExpandableModal
            visible={visible}
            onClose={handleClose}
            title="تأكيد رفض الحجز"
            subtitle={`حجز رقم #${appointment.appointment_id} - ${appointment.patient_name}`}
            iconName="close-circle-outline"
            iconColor="#ef4444"
            iconBgClass="bg-red-500/10">
            <View className="p-4 space-y-4">
                {/* تنبيه تحذيري */}
                <View className="rounded-2xl bg-red-500/10 border border-red-500/20 p-3.5 flex-row-reverse items-start gap-2.5">
                    <Ionicons
                        name="alert-circle"
                        size={20}
                        color="#ef4444"
                        style={{ marginTop: 2 }}
                    />
                    <Text className="flex-1 font-sans-medium text-xs text-red-700 dark:text-red-300 text-right leading-5">
                        أنت على وشك رفض طلب الحجز. يرجى توضيح سبب الرفض ليتم إبلاغ المريض به.
                    </Text>
                </View>

                {/* حقل سبب الرفض */}
                <View className="mt-3">
                    <Text
                        className={`text-right font-sans-bold text-xs mb-2 ${
                            isDark ? "text-slate-200" : "text-slate-700"
                        }`}>
                        سبب الرفض / ملاحظة للمريض:
                    </Text>
                    <TextInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="اكتب سبب الرفض هنا (مثال: عدم توفر الطبيب في هذا اليوم، أو خطأ في سند الدفع)..."
                        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        textAlign="right"
                        className={`w-full rounded-2xl border p-3.5 font-sans-medium text-sm ${
                            isDark
                                ? "bg-slate-800 border-slate-700 text-white"
                                : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                        style={{ minHeight: 90, textAlign: "center"}}
                    />
                </View>

                {/* أزرار الإجراء */}
                <View className="mt-4 flex-row-reverse items-center gap-3">
                    {/* زر تأكيد الرفض */}
                    <Pressable
                        onPress={handleConfirm}
                        disabled={isSubmitting}
                        className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5 bg-red-500 ${
                            isSubmitting ? "opacity-60" : "active:opacity-80"
                        }`}>
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <Ionicons
                                    name="close-circle"
                                    size={18}
                                    color="#ffffff"
                                />
                                <Text className="font-sans-bold text-sm text-white">
                                    تأكيد الرفض
                                </Text>
                            </>
                        )}
                    </Pressable>

                    {/* زر إلغاء */}
                    <Pressable
                        onPress={handleClose}
                        disabled={isSubmitting}
                        className={`px-5 py-3.5 rounded-2xl border ${
                            isDark
                                ? "border-slate-700 bg-slate-800 active:bg-slate-750"
                                : "border-slate-200 bg-white active:bg-slate-100"
                        }`}>
                        <Text
                            className={`font-sans-medium text-sm ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                            إلغاء
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ExpandableModal>
    );
};

export default RejectConfirmationModal;
