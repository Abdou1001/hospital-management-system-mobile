import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import React, {useEffect} from "react";
import {Image, Modal, Pressable, View} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

import {getAdImageSource} from "./HomeAds";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MIN_SCALE = 1;
const MAX_SCALE = 4;

// مقدار الحركة الأساسية
const MAX_TRANSLATE = 150;

const AdImageModal = ({
    ad,
    setSelectedAd,
}: {
    ad: string | null;
    setSelectedAd: (value: null) => void;
}) => {
    const {isDark} = useThemeStore();

    // =========================
    // Zoom
    // =========================

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    // =========================
    // Position
    // =========================

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // =========================
    // Reset
    // =========================

    const resetImage = () => {
        scale.value = 1;
        savedScale.value = 1;

        translateX.value = 0;
        translateY.value = 0;

        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    useEffect(() => {
        resetImage();
    }, [ad]);

    // =========================
    // Pinch
    // =========================

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            const newScale = savedScale.value * event.scale;

            scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

            // إذا رجعت للحجم الطبيعي
            if (scale.value === MIN_SCALE) {
                translateX.value = 0;
                translateY.value = 0;
            }
        })
        .onEnd(() => {
            savedScale.value = scale.value;

            if (scale.value <= MIN_SCALE) {
                scale.value = MIN_SCALE;
                savedScale.value = MIN_SCALE;

                translateX.value = 0;
                translateY.value = 0;

                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
            }
        });

    // =========================
    // Pan
    // =========================

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (scale.value <= MIN_SCALE) {
                return;
            }

            /*
             * كلما زاد التكبير
             * زادت المساحة المسموح للمستخدم
             * أن يحرك فيها الصورة.
             */
            const maxTranslate = MAX_TRANSLATE * (scale.value - MIN_SCALE);

            const nextX = savedTranslateX.value + event.translationX;

            const nextY = savedTranslateY.value + event.translationY;

            // =========================
            // X حدود الحركة الأفقية
            // =========================

            translateX.value = Math.min(
                Math.max(nextX, -maxTranslate),
                maxTranslate,
            );

            // =========================
            // Y حدود الحركة الرأسية
            // =========================

            translateY.value = Math.min(
                Math.max(nextY, -maxTranslate),
                maxTranslate,
            );
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;

            savedTranslateY.value = translateY.value;
        });

    // =========================
    // Pinch + Pan
    // =========================

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    // =========================
    // Animated Style
    // =========================

    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
                {
                    scale: scale.value,
                },
            ],
        };
    });

    // =========================
    // Close
    // =========================

    const handleClose = () => {
        resetImage();
        setSelectedAd(null);
    };

    return (
        <Modal
            visible={ad !== null}
            animationType="fade"
            transparent
            onRequestClose={handleClose}>
            <GestureHandlerRootView style={{flex: 1}}>
                <View className="flex-1 items-center justify-center bg-black/80 p-5">
                    <View
                        className={`w-full max-w-lg overflow-hidden rounded-3xl border p-5 ${
                            isDark
                                ? "border-slate-700 bg-slate-900"
                                : "border-slate-100 bg-white"
                        }`}>
                        {/* زر الإغلاق */}

                        <Pressable
                            onPress={handleClose}
                            className="absolute left-7 top-5 z-50 size-8 items-center justify-center rounded-full bg-red-400">
                            <Ionicons
                                name="close"
                                size={18}
                                color={"#fff"}
                            />
                        </Pressable>

                        {/* منطقة الصورة */}

                        <View className="h-120 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                            <GestureDetector gesture={composedGesture}>
                                <AnimatedImage
                                    source={getAdImageSource(ad || "")}
                                    resizeMode="contain"
                                    style={[
                                        {
                                            width: "100%",
                                            height: "100%",
                                        },
                                        animatedImageStyle,
                                    ]}
                                />
                            </GestureDetector>
                        </View>
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

export default AdImageModal;
