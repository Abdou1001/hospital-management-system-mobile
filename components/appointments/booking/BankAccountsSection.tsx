import {BankAccount} from "@/api/bank-accounts.api";
import {toast} from "@/lib/toast";
import {Ionicons} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {ActivityIndicator, Image, Pressable, Text, View} from "react-native";

interface BankAccountsSectionProps {
    bankAccounts: BankAccount[];
    isLoading: boolean;
    totalFee: number;
    isDark: boolean;
}

const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
    bankAccounts,
    isLoading,
    totalFee,
    isDark,
}) => {
    const handleCopyAccountNumber = async (
        accountNumber: string,
        bankName: string,
    ) => {
        await Clipboard.setStringAsync(accountNumber);
        toast.success(`تم نسخ رقم حساب ${bankName}`);
    };

    if (isLoading) {
        return (
            <View className="mt-5">
                <Text
                    className={`mb-2 font-sans-bold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                    style={{textAlign: "right"}}>
                    الحسابات البنكية للتحويل
                </Text>
                <View
                    className={`items-center justify-center rounded-2xl border p-6 ${
                        isDark
                            ? "border-slate-700 bg-slate-900/40"
                            : "border-slate-200 bg-slate-50"
                    }`}>
                    <ActivityIndicator size="small" color="#10b981" />
                </View>
            </View>
        );
    }

    if (!bankAccounts || bankAccounts.length === 0) return null;

    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{textAlign: "right"}}>
                الحسابات البنكية للتحويل
            </Text>

            <Text
                className="mb-3 font-sans-medium text-xs leading-5 text-muted-foreground dark:text-slate-400"
                style={{textAlign: "right"}}>
                قم بتحويل المبلغ الإجمالي ({totalFee} ر.ي) إلى أحد الحسابات
                التالية
            </Text>

            <View className="gap-2.5">
                {bankAccounts
                    .filter((acc) => acc.is_active)
                    .map((account) => (
                        <View
                            key={account.bank_account_id}
                            className={`overflow-hidden rounded-2xl border p-3 flex-row-reverse items-center gap-2 ${
                                isDark
                                    ? "border-slate-700 bg-slate-900/40"
                                    : "border-slate-200 bg-slate-50"
                            }`}>
                            {/* شعار البنك إن وُجد */}
                            {account.path_image && (
                                <Image
                                    source={{uri: account.path_image}}
                                    className="size-10"
                                    resizeMode="contain"
                                    style={{
                                        backgroundColor: isDark
                                            ? "#1e293b"
                                            : "#f8fafc",
                                    }}
                                />
                            )}

                            {/* اسم البنك */}
                            <View>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        isDark ? "text-white" : "text-slate-800"
                                    }`}
                                    style={{textAlign: "right"}}>
                                    {account.name}
                                </Text>
                            </View>

                            {/* رقم الحساب — اضغط للنسخ */}
                            <Pressable
                                onPress={() =>
                                    handleCopyAccountNumber(
                                        account.account_number,
                                        account.name,
                                    )
                                }
                                className={`mt-3 flex-row-reverse items-center justify-between rounded-xl border px-1.5 py-2 ${
                                    isDark
                                        ? "border-slate-600 bg-slate-800"
                                        : "border-slate-200 bg-white"
                                }`}>
                                <View className="flex-row-reverse items-center gap-2">
                                    <Text
                                        className="font-sans-medium text-[10px] text-muted-foreground dark:text-slate-400"
                                        style={{textAlign: "right"}}>
                                        رقم الحساب:
                                    </Text>
                                    <Text
                                        className={`font-sans-bold text-base ${
                                            isDark
                                                ? "text-white"
                                                : "text-slate-800"
                                        }`}
                                        selectable>
                                        {account.account_number}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1 rounded-lg bg-main/10 px-1 py-1 mr-1">
                                    <Ionicons
                                        name="copy-outline"
                                        size={10}
                                        color="#10b981"
                                    />
                                    <Text className="font-sans-bold text-[8px] text-main">
                                        نسخ
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    ))}
            </View>
        </View>
    );
};

export default BankAccountsSection;
