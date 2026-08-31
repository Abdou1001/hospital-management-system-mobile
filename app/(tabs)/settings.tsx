import SectionTitle from "@/components/shared/SectionTitle";
import AppSettingsSection from "@/components/settings/AppSettingsSection";
import GuestLoginCard from "@/components/settings/GuestLoginCard";
import HospitalInfoCard from "@/components/settings/HospitalInfoCard";
import LogoutButton from "@/components/settings/LogoutButton";
import UserProfileCard from "@/components/settings/UserProfileCard";
import { icons } from "@/constants/icons";
import { useAuth } from "@/hooks/auth/useAuth";
import { styled } from "nativewind";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { refetch, isRefetching } = useCurrentUser();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    colors={["#10b981"]}
                    tintColor="#10b981"
                />
            }
            className="flex-1 bg-background dark:bg-slate-900 p-5">
            <SafeAreaView className="flex-1 mb-20">
                {/* العنوان الرئيسي */}
                <SectionTitle title="الإعدادات" icon={icons.setting} />

                
                {/* 1. معلومات المستخدم أو دعوة تسجيل الدخول */}
                <View className="mt-4">
                    {isLoading ? (
                        <View className="w-full h-32 rounded-3xl border border-border dark:border-slate-800 items-center justify-center mb-5">
                            <ActivityIndicator size="small" color="#10b981" />
                        </View>
                    ) : isAuthenticated && user ? (
                        <UserProfileCard user={user} />
                    ) : (
                        <GuestLoginCard />
                    )}
                </View>

                {/* 2. معلومات عن المستشفى */}
                <HospitalInfoCard />

                {/* 3. الإعدادات الأخرى */}
                <AppSettingsSection />

                {/* 4. زر تسجيل الخروج (يظهر فقط إذا كان المستخدم مسجلاً) */}
                {isAuthenticated && <LogoutButton />}
            </SafeAreaView>
        </ScrollView>
    );
};

export default Settings;
