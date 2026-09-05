import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import React, {useEffect} from "react";
import {Image, Modal, Pressable, Text, View} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MIN_SCALE = 1;
const MAX_SCALE = 4;

// أقصى مقدار لتحريك الصورة
const MAX_TRANSLATE = 150;

const PaymentReceiptModal = ({
    isReceiptOpen,
    setIsReceiptOpen,
    appointment,
}: {
    isReceiptOpen: boolean;
    setIsReceiptOpen: (value: boolean) => void;
    appointment: any;
}) => {
    const {isDark} = useThemeStore();

    // ==========================================
    // Zoom
    // ==========================================

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    // ==========================================
    // Position
    // ==========================================

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // ==========================================
    // Reset image
    // ==========================================

    const resetImage = () => {
        scale.value = 1;
        savedScale.value = 1;

        translateX.value = 0;
        translateY.value = 0;

        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    // ==========================================
    // Reset when modal opens
    // ==========================================

    useEffect(() => {
        if (isReceiptOpen) {
            resetImage();
        }
    }, [isReceiptOpen]);

    // ==========================================
    // Pinch
    // ==========================================

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            const newScale = savedScale.value * event.scale;

            scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

            // إذا رجعت الصورة للحجم الطبيعي
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

    // ==========================================
    // Pan
    // ==========================================

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // لا تسمح بالتحريك إذا لم تكن الصورة مكبرة
            if (scale.value <= MIN_SCALE) {
                return;
            }

            /*
             * كلما زاد التكبير
             * زادت المساحة المسموح بتحريك الصورة فيها.
             */
            const maxTranslate = MAX_TRANSLATE * (scale.value - MIN_SCALE);

            const nextX = savedTranslateX.value + event.translationX;

            const nextY = savedTranslateY.value + event.translationY;

            // الحد الأفقي
            translateX.value = Math.min(
                Math.max(nextX, -maxTranslate),
                maxTranslate,
            );

            // الحد الرأسي
            translateY.value = Math.min(
                Math.max(nextY, -maxTranslate),
                maxTranslate,
            );
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;

            savedTranslateY.value = translateY.value;
        });

    // ==========================================
    // Pinch + Pan
    // ==========================================

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    // ==========================================
    // Animated style
    // ==========================================

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

    // ==========================================
    // Close
    // ==========================================

    const handleClose = () => {
        resetImage();
        setIsReceiptOpen(false);
    };

    return (
        <Modal
            visible={isReceiptOpen}
            transparent
            animationType="fade"
            onRequestClose={handleClose}>
            <GestureHandlerRootView style={{flex: 1}}>
                <View className="flex-1 items-center justify-center bg-black/80 p-5">
                    <View
                        className={`w-full max-w-lg overflow-hidden rounded-3xl border p-5 ${
                            isDark
                                ? "border-slate-700 bg-slate-900"
                                : "border-slate-100 bg-white"
                        }`}>
                        {/* Header */}

                        <View className="flex-row-reverse items-center justify-between border-b border-border pb-3 dark:border-slate-800">
                            <Text
                                className={`font-sans-bold text-base ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                سند الدفع الإلكتروني
                            </Text>

                            <Pressable
                                onPress={handleClose}
                                className="size-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Ionicons
                                    name="close"
                                    size={18}
                                    color={isDark ? "#94a3b8" : "#64748b"}
                                />
                            </Pressable>
                        </View>

                        {/* Receipt */}

                        <View className="my-4 h-150 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                            <GestureDetector gesture={composedGesture}>
                                <AnimatedImage
                                    source={{
                                        uri: appointment.payment_receipt,
                                    }}
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

                        {/* Close Button */}

                        <Pressable
                            onPress={handleClose}
                            className="h-12 w-full items-center justify-center rounded-2xl bg-main">
                            <Text className="font-sans-bold text-sm text-white">
                                إغلاق
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

export default PaymentReceiptModal;
