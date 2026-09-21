import images from "@/constants/images";
import {useThemeStore} from "@/store/theme.store";
import {useRouter} from "expo-router";
import React from "react";
import {Image, ImageSourcePropType, Pressable, Text, View} from "react-native";

export interface DoctorData {
    doctor_id: string | number;
    full_name: string;
    gender: "ذكر" | "أنثى" | string;
    bio?: string | null;
    path_image?: string | null;
    education?: string | null;
    years_exper?: number | null;
    consultation_fee?: number | null;
    phone_number?: string | null;
    email?: string | null;
    notes?: string | null;
    status?: string;
    is_hidden?: boolean;
    doctor_department?: any[];
}

export interface CardDoctorProps {
    doctor: DoctorData;
    departments?: string[];

    onPress?: () => void;
    onBookPress?: () => void;
    onReadMorePress?: () => void;

    className?: string;
}

const getDoctorImage = (doctor: DoctorData): ImageSourcePropType => {
    // إذا كانت صورة الطبيب موجودة
    if (doctor.path_image && doctor.path_image.trim().length > 0) {
        return {
            uri: doctor.path_image,
        };
    }

    // صورة احتياطية حسب الجنس
    if (doctor.gender === "أنثى") {
        return images.femaleDoctor;
    }

    return images.maleDoctor;
};

const CardDoctors = ({
    doctor,
    departments = [],
    onPress,
    onBookPress,
    onReadMorePress,
    className = "",
}: CardDoctorProps) => {
    const router = useRouter();

    // حالة الـ Dark Mode
    const {isDark} = useThemeStore();

    // الضغط على الكارد
    const handlePress = () => {
        if (onPress) {
            onPress();
            return;
        }

        router.push(`/doctor/${doctor.doctor_id}` as any);
    };

    // حجز موعد
    const handleBookPress = () => {
        if (onBookPress) {
            onBookPress();
            return;
        }

        router.push(`/doctor/${doctor.doctor_id}/appointment` as any);
    };

    // قراءة المزيد
    const handleReadMorePress = () => {
        if (onReadMorePress) {
            onReadMorePress();
            return;
        }

        router.push(`/doctor/${doctor.doctor_id}` as any);
    };

    const imageSource = getDoctorImage(doctor);

    const bio = doctor.bio?.trim() || "لا توجد نبذة عن الطبيب";

    // عرض جزء مختصر من الـ bio
    const shortBio = bio.length > 90 ? `${bio.substring(0, 90)}...` : bio;

    return (
        <Pressable
            onPress={handlePress}
            className={`
                w-full
                overflow-hidden
                rounded-3xl
                border
                p-3
                shadow-sm
                ${
                    isDark
                        ? "border-slate-700/60 bg-slate-800"
                        : "border-slate-200 bg-white"
                }
                ${className}
            `}>
            {/* الجزء العلوي */}
            <View className="flex-row-reverse">
                {/* صورة الطبيب */}
                <View
                    className={`
                        h-32
                        w-28
                        overflow-hidden
                        rounded-2xl
                        ${isDark ? "bg-slate-700" : "bg-slate-100"}
                    `}>
                    <Image
                        source={imageSource}
                        resizeMode="cover"
                        className="size-full"
                    />
                </View>

                {/* معلومات الطبيب */}
                <View className="mr-3 flex-1">
                    {/* الاسم */}
                    <Text
                        numberOfLines={1}
                        className={`
                            text-right
                            text-lg
                            font-sans-bold
                            ${isDark ? "text-slate-100" : "text-slate-800"}
                        `}>
                        {doctor.full_name}
                    </Text>

                    {/* التخصصات */}
                    <View className="mt-2 w-full flex-row-reverse flex-wrap gap-2">
                        {departments.length > 0 ? (
                            departments.map((department, index) => (
                                <View
                                    key={`${department}-${index}`}
                                    className={`
                                            rounded-full
                                            px-3
                                            py-1.5
                                            ${
                                                isDark
                                                    ? "bg-green-900/40"
                                                    : "bg-green-50"
                                            }
                                        `}>
                                    <Text
                                        className={`
                                                text-xs
                                                font-sans-semibold
                                                ${
                                                    isDark
                                                        ? "text-green-300"
                                                        : "text-green-700"
                                                }
                                            `}>
                                        {department}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View
                                className={`
                                    items-center
                                    justify-center
                                    rounded-full
                                    px-3
                                    py-1.5
                                    ${isDark ? "bg-slate-700" : "bg-slate-100"}
                                `}>
                                <Text
                                    className={`
                                        text-xs
                                        font-sans-medium
                                        ${
                                            isDark
                                                ? "text-slate-300"
                                                : "text-slate-500"
                                        }
                                    `}>
                                    لا يوجد تخصص
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Bio */}
                    <Text
                        numberOfLines={3}
                        className={`
                            mt-3
                            text-right
                            text-sm
                            font-sans-medium
                            leading-5
                            ${isDark ? "text-slate-300" : "text-slate-500"}
                        `}>
                        {shortBio}
                    </Text>
                </View>
            </View>

            {/* الأزرار */}
            <View className="mt-5 flex-row-reverse gap-4">
                {/* Primary Button - حجز موعد */}
                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        handleBookPress();
                    }}
                    className="
                        flex-1
                        items-center
                        justify-center
                        rounded-xl
                        bg-main
                        py-3
                    ">
                    <Text
                        className="
                            text-sm
                            font-sans-bold
                            text-white
                        ">
                        حجز موعد
                    </Text>
                </Pressable>

                {/* Secondary Button - اقرأ المزيد */}
                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        handleReadMorePress();
                    }}
                    className={`
                        flex-1
                        items-center
                        justify-center
                        rounded-xl
                        border
                        py-3
                        ${
                            isDark
                                ? "border-green-400 bg-transparent"
                                : "border-green-600 bg-transparent"
                        }
                    `}>
                    <Text
                        className={`
                            text-sm
                            font-sans-bold
                            ${isDark ? "text-green-400" : "text-green-600"}
                        `}>
                        اقرأ المزيد
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

export default CardDoctors;
