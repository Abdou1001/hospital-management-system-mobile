import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface SuccessModalProps {
    visible: boolean;
    onViewAppointments: () => void;
    onGoBack: () => void;
    isDark: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onViewAppointments,
    onGoBack,
    isDark,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {}}>
            <View className="flex-1 items-center justify-center bg-black/60 px-5">
                <View
                    className={`w-full max-w-sm rounded-3xl border p-6 shadow-2xl ${
                        isDark
                            ? "border-slate-800 bg-slate-900"
                            : "border-slate-100 bg-white"
                    }`}>
                    {/* أيقونة النجاح */}
                    <View className="mb-5 items-center">
                        <View className="size-20 items-center justify-center rounded-full border-2 border-green-500/20 bg-green-500/10">
                            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                        </View>
                    </View>

                    <Text
                        className={`text-center font-sans-bold text-xl ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>
                        تم إرسال طلب الحجز بنجاح
                    </Text>

                    <Text
                        className="mt-3 text-center font-sans-medium text-sm leading-6 text-muted-foreground dark:text-slate-400">
                        سيتم مراجعة طلبك الآن من موظف الاستقبال وسيتم تأكيد حجزك قريباً.
                    </Text>

                    {/* ملاحظة السند */}
                    <View
                        className={`mt-4 rounded-2xl border p-4 ${
                            isDark
                                ? "border-main/20 bg-main/5"
                                : "border-green-200 bg-green-50"
                        }`}>
                        <View className="flex-row-reverse items-start gap-2">
                            <Ionicons name="document-text-outline" size={18} color="#10b981" />
                            <Text
                                className="flex-1 font-sans-medium text-xs leading-5 text-green-700 dark:text-green-400"
                                style={{ textAlign: "right" }}>
                                حافظ على سند الدفع وأحضره معك عند مراجعة الطبيب
                            </Text>
                        </View>
                    </View>

                    {/* دعاء */}
                    <View className="mt-4 items-center rounded-2xl border border-main/10 bg-main/5 p-3">
                        <Text className="text-center font-sans-bold text-sm text-main">
                            🤲 نسأل الله الشفاء العاجل لمريضك
                        </Text>
                    </View>

                    {/* الأزرار */}
                    <View className="mt-5 gap-2.5">
                        <Pressable
                            onPress={onViewAppointments}
                            className="h-12 items-center justify-center rounded-xl bg-main shadow">
                            <Text className="font-sans-bold text-sm text-white">
                                عرض حجوزاتي
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={onGoBack}
                            className={`h-12 items-center justify-center rounded-xl ${
                                isDark ? "bg-slate-800" : "bg-slate-100"
                            }`}>
                            <Text className={`font-sans-bold text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                العودة للطبيب
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SuccessModal;
