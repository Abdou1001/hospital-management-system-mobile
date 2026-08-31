import DepartmentSection from "@/components/home/DepartmentSection";
import DoctorSection from "@/components/home/DoctorSection";
import HomeAds from "@/components/home/HomeAds";
import UpperSection from "@/components/shared/UpperSection";
import "@/global.css";
import { User } from "@/validation/users/schemas/user.schema";
import {styled} from "nativewind";
import React from "react";
import {Keyboard, ScrollView, TouchableWithoutFeedback} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView className="bg-background dark:bg-slate-900">
                <SafeAreaView className="flex-1 p-5 mb-20">
                    <UpperSection />

                    {/* Ads */}
                    <HomeAds />

                    {/* Department */}
                    <DepartmentSection />

                    {/* Doctors */}
                    <DoctorSection />
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
