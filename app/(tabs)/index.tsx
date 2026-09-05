import DepartmentSection from "@/components/home/DepartmentSection";
import DoctorSection from "@/components/home/DoctorSection";
import HomeAds from "@/components/home/HomeAds";
import UpperSection from "@/components/shared/UpperSection";
import { useDebounce } from "@/hooks/shared/useDebounce";
import "@/global.css";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 800);
    const router = useRouter();

    const handleSearch = useCallback(() => {
        const query = searchQuery.trim();
        if (query) {
            router.push({
                pathname: "/(tabs)/doctors",
                params: { keyword: query },
            });
            setSearchQuery("")
        } else {
            router.push("/(tabs)/doctors");
        }
    }, [searchQuery, router]);

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 pb-20">
                {/* Header and Search */}
                <UpperSection
                    placeholder="ابحث عن طبيبك بالاسم أو التخصص..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    onScrollBeginDrag={Keyboard.dismiss}>
                    {/* Ads */}
                    <HomeAds />

                    {/* Department */}
                    <DepartmentSection />

                    {/* Doctors */}
                    <DoctorSection  />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
