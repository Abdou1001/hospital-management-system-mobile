import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import ExpandableModal from "@/components/ui/ExpandableModal";
import { useChangePhone } from "@/hooks/auth/useChangePhone";
import { useResendChangePhoneOtp } from "@/hooks/auth/useResendChangePhoneOtp";
import { useVerifyChangePhone } from "@/hooks/auth/useVerifyChangePhone";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";

interface ChangePhoneModalProps {
    visible: boolean;
    onClose: () => void;
    currentPhone?: string;
}

const ChangePhoneModal: React.FC<ChangePhoneModalProps> = ({
    visible,
    onClose,
    currentPhone,
}) => {
    const { isDark } = useThemeStore();
    const { mutate: requestChangePhone, isPending: isRequesting } =
        useChangePhone();
    const { mutate: verifyChangePhone, isPending: isVerifying } =
        useVerifyChangePhone();
    const { mutate: resendOtp, isPending: isResending } =
        useResendChangePhoneOtp();

    const [step, setStep] = useState<1 | 2>(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setPhoneNumber("");
            setOtp("");
            setError(null);
        }
    }, [visible]);

    const handleSendPhone = () => {
        setError(null);
        const cleanPhone = phoneNumber.trim();

        if (!cleanPhone) {
            setError("يرجى إدخال رقم الهاتف الجديد");
            toast.error("يرجى إدخال رقم الهاتف الجديد");
            return;
        }

        if (cleanPhone === currentPhone) {
            setError("رقم الهاتف الجديد يطابق رقم هاتفك الحالي");
            toast.error("رقم الهاتف الجديد يطابق رقم هاتفك الحالي");
            return;
        }

        if (!/^[0-9]{9,15}$/.test(cleanPhone)) {
            setError("يرجى إدخال رقم هاتف صحيح");
            toast.error("رقم الهاتف غير صحيح");
            return;
        }

        requestChangePhone(
            { phone_number: cleanPhone },
            {
                onSuccess: () => {
                    setStep(2);
                },
            }
        );
    };

    const handleVerifyOtp = () => {
        setError(null);
        const cleanOtp = otp.trim();

        if (!cleanOtp) {
            setError("يرجى إدخال رمز التحقق");
            toast.error("يرجى إدخال رمز التحقق");
            return;
        }

        if (cleanOtp.length < 4) {
            setError("رمز التحقق غير مكتمل");
            toast.error("رمز التحقق غير مكتمل");
            return;
        }

        verifyChangePhone(
            { otp: cleanOtp },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <ExpandableModal
            visible={visible}
            onClose={onClose}
            title="تغيير رقم الهاتف"
            subtitle={step === 1 ? "الخطوة 1 من 2" : "الخطوة 2 من 2"}
            iconName="phone-portrait-outline"
            iconColor="#10b981"
            iconBgClass="bg-main/15">
            {/* Step 1: Input New Phone Number */}
            {step === 1 && (
                <View className="pt-2">
                    <Text
                        className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mb-4"
                        style={{ textAlign: "right" }}>
                        أدخل رقم هاتفك الجديد وسنرسل لك رمز تحقق (OTP) على الواتساب لتأكيد الملكية.
                    </Text>

                    <View className="mb-4">
                        <Text
                            className={`mb-2 font-sans-bold text-sm ${
                                isDark
                                    ? "text-slate-200"
                                    : "text-slate-700"
                            }`}
                            style={{ textAlign: "right" }}>
                            رقم الهاتف الجديد
                        </Text>
                        <View
                            className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                error
                                    ? "border-red-500 bg-red-50/20"
                                    : isDark
                                      ? "border-slate-700 bg-slate-800"
                                      : "border-slate-200 bg-slate-50"
                            }`}>
                            <TextInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="7xxxxxxxx"
                                placeholderTextColor={
                                    isDark ? "#64748b" : "#94a3b8"
                                }
                                keyboardType="phone-pad"
                                className={`flex-1 font-sans-medium text-base ${
                                    isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                                style={{ textAlign: "right" }}
                            />
                            <Ionicons
                                name="phone-portrait-outline"
                                size={20}
                                color={isDark ? "#64748b" : "#94a3b8"}
                            />
                        </View>
                        {error ? (
                            <Text
                                className="mt-1 font-sans-medium text-xs text-red-500"
                                style={{ textAlign: "right" }}>
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    <Pressable
                        disabled={isRequesting}
                        onPress={handleSendPhone}
                        className={`mt-2 h-14 w-full rounded-2xl bg-main items-center justify-center shadow-md active:opacity-80 ${
                            isRequesting ? "opacity-70" : ""
                        }`}>
                        {isRequesting ? (
                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />
                        ) : (
                            <Text className="font-sans-bold text-base text-white">
                                إرسال رمز التحقق
                            </Text>
                        )}
                    </Pressable>
                </View>
            )}

            {/* Step 2: Input OTP */}
            {step === 2 && (
                <View className="pt-2">
                    <View
                        className={`mb-4 flex-row-reverse items-center gap-3 rounded-2xl border px-4 py-3 ${
                            isDark
                                ? "border-slate-700 bg-slate-800"
                                : "border-slate-200 bg-slate-50"
                        }`}>
                        <Ionicons
                            name="phone-portrait-outline"
                            size={20}
                            color="#10b981"
                        />
                        <View className="flex-1">
                            <Text
                                className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                                style={{ textAlign: "right" }}>
                                تم إرسال رمز التحقق إلى:
                            </Text>
                            <Text
                                className={`font-sans-bold text-base ${
                                    isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                                style={{ textAlign: "right" }}>
                                {phoneNumber}
                            </Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text
                            className={`mb-2 font-sans-bold text-sm ${
                                isDark
                                    ? "text-slate-200"
                                    : "text-slate-700"
                            }`}
                            style={{ textAlign: "right" }}>
                            رمز التحقق (OTP)
                        </Text>
                        <View
                            className={`h-16 w-full flex-row items-center justify-center rounded-2xl border px-4 ${
                                error
                                    ? "border-red-500 bg-red-50/20"
                                    : isDark
                                      ? "border-slate-700 bg-slate-800"
                                      : "border-slate-200 bg-slate-50"
                            }`}>
                            <TextInput
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="• • • • • •"
                                placeholderTextColor={
                                    isDark ? "#64748b" : "#94a3b8"
                                }
                                keyboardType="number-pad"
                                maxLength={6}
                                className={`w-full font-sans-bold text-center text-2xl tracking-widest ${
                                    isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                }`}
                            />
                        </View>
                        {error ? (
                            <Text
                                className="mt-1 font-sans-medium text-xs text-red-500"
                                style={{ textAlign: "right" }}>
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    {/* Verify Button */}
                    <Pressable
                        disabled={isVerifying}
                        onPress={handleVerifyOtp}
                        className={`h-14 w-full rounded-2xl bg-main items-center justify-center shadow-md active:opacity-80 ${
                            isVerifying ? "opacity-70" : ""
                        }`}>
                        {isVerifying ? (
                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />
                        ) : (
                            <Text className="font-sans-bold text-base text-white">
                                تأكيد تغيير الرقم
                            </Text>
                        )}
                    </Pressable>

                    {/* Resend OTP & Back */}
                    <View className="mt-4 flex-row-reverse items-center justify-between">
                        <Pressable
                            disabled={isResending}
                            onPress={() => resendOtp()}
                            className="p-2">
                            <Text className="font-sans-bold text-xs text-main dark:text-emerald-400">
                                {isResending
                                    ? "جارٍ الإرسال..."
                                    : "إعادة إرسال الرمز"}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setStep(1)}
                            className="p-2">
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                تغيير الرقم المدخل
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </ExpandableModal>
    );
};

export default ChangePhoneModal;
