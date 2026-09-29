import {User} from "@/store/auth.store";
import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangePhoneModal from "./ChangePhoneModal";
import EditProfileModal from "./EditProfileModal";

interface UserProfileCardProps {
    user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({user}) => {
    const {isDark} = useThemeStore();

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePhoneOpen, setIsChangePhoneOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const getRoleTitle = (role?: string) => {
        switch (role) {
            case "admin":
                return "مدير النظام";
            case "reception":
                return "موظف استقبال";
            case "doctor":
                return "طبيب";
            case "user":
            default:
                return "مريض / مستخدم";
        }
    };

    return (
        <>
            <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400 text-right mb-3 px-1">
                معلومات عن الحساب
            </Text>
            <View
                className={`w-full rounded-3xl border p-5 shadow-sm mb-5 ${
                    isDark
                        ? "border-slate-800 bg-slate-800/90"
                        : "border-slate-100 bg-white"
                }`}>
                {/* Header: Avatar, Name & Role */}
                <View className="flex-row-reverse items-center gap-4 pb-4 border-b border-border dark:border-slate-700/70">
                    <View className="size-16 rounded-2xl bg-main/15 border-2 border-main/30 items-center justify-center">
                        <Ionicons name="person" size={32} color="#10b981" />
                    </View>

                    <View className="flex-1 items-end">
                        <Text
                            className={`font-sans-bold text-lg ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                            style={{textAlign: "right"}}>
                            {user.full_name || "مستخدم"}
                        </Text>

                        {/* Role & Status Badges */}
                        <View className="flex-row-reverse items-center gap-2 mt-1">
                            <View className="rounded-full bg-main/15 px-2 py-0.5 border border-main/30">
                                <Text className="font-sans-medium text-[11px] text-main dark:text-emerald-400">
                                    {getRoleTitle(user.role)}
                                </Text>
                            </View>

                            {user.is_active && (
                                <View className="rounded-full bg-blue-500/10 px-2 py-0.5 border border-blue-500/20">
                                    <Text className="font-sans-medium text-[11px] text-blue-600 dark:text-blue-400">
                                        {user.is_active === "active"
                                            ? "حساب نشط"
                                            : user.is_active}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Details List */}
                <View className="pt-4 space-y-3 gap-2.5">
                    {/* Phone Number */}
                    <View className="flex-row-reverse items-center justify-between">
                        <View className="flex-row-reverse items-center gap-2">
                            <View className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 items-center justify-center">
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={16}
                                    color={isDark ? "#94a3b8" : "#64748b"}
                                />
                            </View>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                رقم الهاتف:
                            </Text>
                        </View>
                        <Text
                            className={`font-sans-bold text-sm ${
                                isDark ? "text-slate-200" : "text-slate-800"
                            }`}>
                            {user.phone_number || "—"}
                        </Text>
                    </View>

                    {/* Email (if exists) */}
                    {user.email ? (
                        <View className="flex-row-reverse items-center justify-between">
                            <View className="flex-row-reverse items-center gap-2">
                                <View className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 items-center justify-center">
                                    <Ionicons
                                        name="mail-outline"
                                        size={16}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </View>
                                <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                    البريد الإلكتروني:
                                </Text>
                            </View>
                            <Text
                                className={`font-sans-bold text-xs ${
                                    isDark ? "text-slate-200" : "text-slate-800"
                                }`}>
                                {user.email}
                            </Text>
                        </View>
                    ) : null}

                    {/* Date of Birth */}
                    {user.date_of_birth ? (
                        <View className="flex-row-reverse items-center justify-between">
                            <View className="flex-row-reverse items-center gap-2">
                                <View className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 items-center justify-center">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={16}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </View>
                                <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                    تاريخ الميلاد:
                                </Text>
                            </View>
                            <Text
                                className={`font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-800"
                                }`}>
                                {user.date_of_birth}
                            </Text>
                        </View>
                    ) : null}

                    {/* Gender */}
                    {user.gender ? (
                        <View className="flex-row-reverse items-center justify-between">
                            <View className="flex-row-reverse items-center gap-2">
                                <View className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 items-center justify-center">
                                    <Ionicons
                                        name="male-female-outline"
                                        size={16}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </View>
                                <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                    الجنس:
                                </Text>
                            </View>
                            <Text
                                className={`font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-800"
                                }`}>
                                {user.gender}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Account Actions Buttons */}
                <View className="mt-5 pt-4 border-t border-border dark:border-slate-700/70 gap-2.5">
                    {/* تعديل البيانات الشخصية */}
                    <Pressable
                        onPress={() => setIsEditProfileOpen(true)}
                        className="h-12 w-full flex-row-reverse items-center justify-between rounded-2xl bg-main/10 border border-main/20 px-4">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <Ionicons
                                name="create-outline"
                                size={18}
                                color="#10b981"
                            />
                            <Text className="font-sans-bold text-sm text-main dark:text-emerald-400">
                                تعديل البيانات الشخصية
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-back-outline"
                            size={16}
                            color="#10b981"
                        />
                    </Pressable>

                    {/* أزرار الحساب في صف واحد: تغيير رقم الهاتف + تغيير كلمة المرور */}
                    <View className="flex-row-reverse items-center gap-2.5">
                        {/* تغيير رقم الهاتف */}
                        <Pressable
                            onPress={() => setIsChangePhoneOpen(true)}
                            className="flex-1 h-11 flex-row-reverse items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3">
                            <Ionicons
                                name="phone-portrait-outline"
                                size={16}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                className={`font-sans-bold text-xs ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                }`}>
                                تغيير رقم الهاتف
                            </Text>
                        </Pressable>

                        {/* تغيير كلمة المرور */}
                        <Pressable
                            onPress={() => setIsChangePasswordOpen(true)}
                            className="flex-1 h-11 flex-row-reverse items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3">
                            <Ionicons
                                name="lock-closed-outline"
                                size={16}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                className={`font-sans-bold text-xs ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                }`}>
                                تغيير كلمة المرور
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Modals */}
            <EditProfileModal
                visible={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={user}
            />

            <ChangePhoneModal
                visible={isChangePhoneOpen}
                onClose={() => setIsChangePhoneOpen(false)}
                currentPhone={user.phone_number}
            />

            <ChangePasswordModal
                visible={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </>
    );
};

export default UserProfileCard;
