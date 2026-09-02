import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PaymentReceiptUploaderProps {
    paymentImage: {
        uri: string;
        name: string;
        type: string;
    } | null;
    setPaymentImage: (img: { uri: string; name: string; type: string } | null) => void;
    errors: Record<string, string>;
    isDark: boolean;
}

const PaymentReceiptUploader: React.FC<PaymentReceiptUploaderProps> = ({
    paymentImage,
    setPaymentImage,
    errors,
    isDark,
}) => {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const fileName = asset.uri.split("/").pop() || "payment.jpg";
            const fileType = asset.mimeType || "image/jpeg";

            setPaymentImage({
                uri: asset.uri,
                name: fileName,
                type: fileType,
            });
        }
    };

    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{ textAlign: "right" }}>
                سند الدفع (إلزامي)
            </Text>

            <Text
                className="mb-3 font-sans-medium text-xs leading-5 text-muted-foreground dark:text-slate-400"
                style={{ textAlign: "right" }}>
                ارفع صورة سند الدفع بعد التحويل
            </Text>

            {paymentImage ? (
                <View className="relative">
                    <Image
                        source={{ uri: paymentImage.uri }}
                        className="w-full rounded-2xl"
                        style={{ height: undefined, aspectRatio: undefined, minHeight: 250 }}
                        resizeMode="contain"
                    />
                    <Pressable
                        onPress={() => setPaymentImage(null)}
                        className="absolute left-2 top-2 size-8 items-center justify-center rounded-full bg-red-500 shadow-lg">
                        <Ionicons name="close" size={18} color="#ffffff" />
                    </Pressable>
                    <View className="absolute bottom-2 right-2 flex-row-reverse items-center gap-1 rounded-full bg-green-600/90 px-3 py-1">
                        <Ionicons name="checkmark-circle" size={14} color="#ffffff" />
                        <Text className="font-sans-bold text-xs text-white">
                            تم رفع السند
                        </Text>
                    </View>
                </View>
            ) : (
                <Pressable
                    onPress={pickImage}
                    className={`w-full items-center justify-center rounded-2xl border-2 border-dashed py-8 ${
                        errors.payment_receipt
                            ? "border-red-400 bg-red-50/10"
                            : isDark
                              ? "border-slate-600 bg-slate-900/40"
                              : "border-slate-300 bg-slate-50"
                    }`}>
                    <View className="mb-3 size-14 items-center justify-center rounded-full bg-main/10">
                        <Ionicons name="cloud-upload-outline" size={28} color="#10b981" />
                    </View>
                    <Text
                        className={`font-sans-bold text-sm ${
                            isDark ? "text-slate-200" : "text-slate-700"
                        }`}>
                        اضغط لرفع صورة سند الدفع
                    </Text>
                    <Text className="mt-1 font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        يدعم JPG, PNG, WEBP
                    </Text>
                </Pressable>
            )}

            {errors.payment_receipt ? (
                <Text className="mt-1 font-sans-medium text-xs text-red-500" style={{ textAlign: "right" }}>
                    {errors.payment_receipt}
                </Text>
            ) : null}
        </View>
    );
};

export default PaymentReceiptUploader;
