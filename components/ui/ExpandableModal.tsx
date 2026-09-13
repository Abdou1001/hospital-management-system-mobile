import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ExpandableModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    iconBgClass?: string;
    children: React.ReactNode;
    subtitle?: string;
    allowManualExpand?: boolean;
}

// Spring configuration with overshootClamping to eliminate unwanted bounce (ارتداد)
// and deliver a smooth, natural deceleration curve
const SMOOTH_SPRING = {
    damping: 32,
    stiffness: 260,
    mass: 0.8,
    overshootClamping: true,
};

export const ExpandableModal: React.FC<ExpandableModalProps> = ({
    visible,
    onClose,
    title,
    iconName = "create-outline",
    iconColor = "#10b981",
    iconBgClass = "bg-main/15",
    children,
    subtitle,
    allowManualExpand = true,
}) => {
    const {isDark} = useThemeStore();
    const insets = useSafeAreaInsets();
    const {height: screenHeight} = useWindowDimensions();

    // Snap Points
    const FULL_SNAP = 0; // Fullscreen: top at 0
    const NORMAL_SNAP = Math.round(screenHeight * 0.16); // Normal Sheet: top at 16% of screen
    const CLOSED_SNAP = screenHeight; // Hidden: off the screen

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isManualExpanded, setIsManualExpanded] = useState(false);

    const isFullscreen = isManualExpanded || isKeyboardVisible;
    const isManualExpandedRef = useRef(isManualExpanded);
    useEffect(() => {
        isManualExpandedRef.current = isManualExpanded;
    }, [isManualExpanded]);

    // Reanimated Values
    const translateY = useSharedValue(CLOSED_SNAP);
    const backdropOpacity = useSharedValue(0);
    const startY = useSharedValue(0);

    const allowManualExpandShared = useSharedValue(allowManualExpand);
    useEffect(() => {
        allowManualExpandShared.value = allowManualExpand;
    }, [allowManualExpand]);

    // Smooth exit animation
    const handleCloseAnimated = useCallback(() => {
        backdropOpacity.value = withTiming(0, {
            duration: 200,
            easing: Easing.in(Easing.ease),
        });
        translateY.value = withTiming(
            CLOSED_SNAP,
            {
                duration: 240,
                easing: Easing.bezier(0.3, 0, 0.8, 0.15),
            },
            (finished) => {
                if (finished) {
                    runOnJS(onClose)();
                }
            },
        );
    }, [onClose, CLOSED_SNAP, backdropOpacity, translateY]);

    // Visibility Entrance / Reset
    useEffect(() => {
        if (visible) {
            setIsManualExpanded(false);
            setIsKeyboardVisible(false);
            translateY.value = CLOSED_SNAP;
            backdropOpacity.value = 0;

            backdropOpacity.value = withTiming(1, {
                duration: 260,
                easing: Easing.out(Easing.ease),
            });
            translateY.value = withSpring(NORMAL_SNAP, SMOOTH_SPRING);
        } else {
            translateY.value = CLOSED_SNAP;
            backdropOpacity.value = 0;
        }
    }, [visible, CLOSED_SNAP, NORMAL_SNAP, backdropOpacity, translateY]);

    // Keyboard show/hide listeners with smooth transition
    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showListener = Keyboard.addListener(showEvent, () => {
            setIsKeyboardVisible(true);
            translateY.value = withSpring(FULL_SNAP, SMOOTH_SPRING);
        });

        const hideListener = Keyboard.addListener(hideEvent, () => {
            setIsKeyboardVisible(false);
            if (!isManualExpandedRef.current) {
                translateY.value = withSpring(NORMAL_SNAP, SMOOTH_SPRING);
            }
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, [FULL_SNAP, NORMAL_SNAP, translateY]);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // Toggle expand button
    const toggleExpand = useCallback(() => {
        Keyboard.dismiss();
        const willBeExpanded = !isManualExpanded;
        setIsManualExpanded(willBeExpanded);

        translateY.value = withSpring(
            willBeExpanded ? FULL_SNAP : NORMAL_SNAP,
            SMOOTH_SPRING,
        );
    }, [isManualExpanded, FULL_SNAP, NORMAL_SNAP, translateY]);

    // Gesture Pan Handler
    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .onStart(() => {
                    "worklet";
                    startY.value = translateY.value;
                    runOnJS(dismissKeyboard)();
                })
                .onUpdate((event) => {
                    "worklet";
                    const nextY = startY.value + event.translationY;

                    if (nextY < FULL_SNAP) {
                        // Subtle resistance when pulled higher than fullscreen
                        translateY.value =
                            FULL_SNAP + (nextY - FULL_SNAP) * 0.15;
                    } else if (
                        !allowManualExpandShared.value &&
                        nextY < NORMAL_SNAP
                    ) {
                        // Subtle resistance when pulled up and manual expand is disabled
                        translateY.value =
                            NORMAL_SNAP + (nextY - NORMAL_SNAP) * 0.2;
                    } else {
                        translateY.value = nextY;
                    }
                })
                .onEnd((event) => {
                    "worklet";
                    const currentY = translateY.value;
                    const {velocityY} = event;

                    // 1. Dragged down past dismiss threshold or with high downward velocity -> Close
                    if (velocityY > 800 || currentY > NORMAL_SNAP + 140) {
                        runOnJS(handleCloseAnimated)();
                        return;
                    }

                    // 2. Decide between FULL_SNAP and NORMAL_SNAP
                    if (allowManualExpandShared.value) {
                        const midPoint = (FULL_SNAP + NORMAL_SNAP) / 2;

                        if (
                            velocityY < -400 ||
                            (currentY < midPoint && velocityY < 300)
                        ) {
                            // Snap to Fullscreen
                            translateY.value = withSpring(
                                FULL_SNAP,
                                SMOOTH_SPRING,
                            );
                            runOnJS(setIsManualExpanded)(true);
                        } else {
                            // Snap to Normal Sheet
                            translateY.value = withSpring(
                                NORMAL_SNAP,
                                SMOOTH_SPRING,
                            );
                            runOnJS(setIsManualExpanded)(false);
                        }
                    } else {
                        // Expand not allowed: snap back to Normal
                        translateY.value = withSpring(
                            NORMAL_SNAP,
                            SMOOTH_SPRING,
                        );
                    }
                }),
        [
            handleCloseAnimated,
            allowManualExpandShared,
            FULL_SNAP,
            NORMAL_SNAP,
            translateY,
        ],
    );

    const handleBackdropPress = () => {
        if (isKeyboardVisible) {
            Keyboard.dismiss();
        } else {
            handleCloseAnimated();
        }
    };

    // Interpolated animated styles for continuous smooth transitions
    const sheetAnimatedStyle = useAnimatedStyle(() => {
        const cornerRadius = interpolate(
            translateY.value,
            [FULL_SNAP, NORMAL_SNAP],
            [0, 28],
            Extrapolation.CLAMP,
        );

        const paddingTop = interpolate(
            translateY.value,
            [FULL_SNAP, NORMAL_SNAP],
            [Math.max(insets.top, 16), 12],
            Extrapolation.CLAMP,
        );

        return {
            transform: [{translateY: translateY.value}],
            borderTopLeftRadius: cornerRadius,
            borderTopRightRadius: cornerRadius,
            paddingTop,
        };
    });

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={handleCloseAnimated}
            statusBarTranslucent>
            <GestureHandlerRootView style={{flex: 1}}>
                <View className="flex-1 justify-end">
                    {/* Animated Backdrop */}
                    <TouchableWithoutFeedback onPress={handleBackdropPress}>
                        <Animated.View
                            style={backdropAnimatedStyle}
                            className="absolute inset-0 bg-black/60"
                        />
                    </TouchableWithoutFeedback>

                    {/* Sheet Animated Container */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Animated.View
                            style={[
                                sheetAnimatedStyle,
                                {
                                    height: screenHeight,
                                },
                            ]}
                            className={`w-full border-t px-6 ${
                                isDark
                                    ? "border-slate-800 bg-slate-900"
                                    : "border-slate-100 bg-white"
                            }`}>
                            {/* Gesture Drag Handle Header Area */}
                            <GestureDetector gesture={panGesture}>
                                <View className="w-full">
                                    {/* Top Indicator Pill */}
                                    <View className="items-center justify-center pb-2.5 pt-1.5">
                                        <View className="h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    </View>

                                    {/* Modal Header */}
                                    <View className="flex-row-reverse items-center justify-between pb-3.5 border-b border-border/60 dark:border-slate-800">
                                        {/* Right Side: Icon + Title */}
                                        <View className="flex-row-reverse items-center gap-2.5 flex-1 pl-2">
                                            <View
                                                className={`size-10 rounded-xl ${iconBgClass} items-center justify-center shrink-0`}>
                                                <Ionicons
                                                    name={iconName}
                                                    size={22}
                                                    color={iconColor}
                                                />
                                            </View>
                                            <View className="items-end flex-1">
                                                <Text
                                                    numberOfLines={1}
                                                    className={`font-sans-bold text-lg ${
                                                        isDark
                                                            ? "text-white"
                                                            : "text-slate-900"
                                                    }`}>
                                                    {title}
                                                </Text>
                                                {subtitle ? (
                                                    <Text
                                                        numberOfLines={1}
                                                        className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                                        {subtitle}
                                                    </Text>
                                                ) : (
                                                    <Text className="font-sans-medium text-[11px] text-muted-foreground/70 dark:text-slate-500">
                                                        {isFullscreen
                                                            ? "اسحب للأسفل للتصغير"
                                                            : "اسحب للأعلى للتكبير"}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        {/* Left Side: Expand/Collapse Button + Close Button */}
                                        <View className="flex-row items-center gap-2">
                                            {allowManualExpand && (
                                                <Pressable
                                                    onPress={toggleExpand}
                                                    hitSlop={{
                                                        top: 8,
                                                        bottom: 8,
                                                        left: 8,
                                                        right: 8,
                                                    }}
                                                    className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:opacity-70">
                                                    <Ionicons
                                                        name={
                                                            isFullscreen
                                                                ? "contract-outline"
                                                                : "expand-outline"
                                                        }
                                                        size={18}
                                                        color={
                                                            isDark
                                                                ? "#94a3b8"
                                                                : "#64748b"
                                                        }
                                                    />
                                                </Pressable>
                                            )}

                                            <Pressable
                                                onPress={handleCloseAnimated}
                                                hitSlop={{
                                                    top: 8,
                                                    bottom: 8,
                                                    left: 8,
                                                    right: 8,
                                                }}
                                                className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:opacity-70">
                                                <Ionicons
                                                    name="close"
                                                    size={20}
                                                    color={
                                                        isDark
                                                            ? "#94a3b8"
                                                            : "#64748b"
                                                    }
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </GestureDetector>

                            {/* Modal Body with Scroll */}
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{
                                    paddingVertical: 16,
                                    paddingBottom: 40,
                                    flexGrow: 1,
                                }}>
                                <TouchableWithoutFeedback
                                    onPress={Keyboard.dismiss}>
                                    <View className="flex-1">{children}</View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

export default ExpandableModal;
