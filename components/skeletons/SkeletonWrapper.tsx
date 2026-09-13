import React, { useEffect, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from "react-native-reanimated";
import { useThemeStore } from "@/store/theme.store";

export interface SkeletonWrapperProps {
    children: React.ReactElement;
    background?: string;
    highlight?: string;
    duration?: number;
    style?: StyleProp<ViewStyle>;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
    children,
    background,
    highlight,
    duration = 1200,
    style,
}) => {
    const { isDark } = useThemeStore();

    // Natural slate colors matching the app design
    const defaultBg = isDark ? "#1e293b" : "#e2e8f0";
    const defaultHighlight = isDark ? "#334155" : "#f1f5f9";

    const bg = background || defaultBg;
    const hl = highlight || defaultHighlight;

    const [layout, setLayout] = useState<{ width: number; height: number } | null>(null);
    const layoutWidth = useSharedValue(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = 0;
        progress.value = withRepeat(
            withTiming(1, { duration, easing: Easing.linear }),
            -1,
            false
        );
    }, [duration, progress]);

    const animStyle = useAnimatedStyle(() => {
        const width = layoutWidth.value;
        const translateX = interpolate(
            progress.value,
            [0, 1],
            [-width, width]
        );
        return {
            transform: [{ translateX }],
        };
    });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0) {
            layoutWidth.value = width;
            setLayout((prev) => {
                if (prev && prev.width === width && prev.height === height) {
                    return prev;
                }
                return { width, height };
            });
        }
    };

    if (!layout) {
        return (
            <View onLayout={onLayout} style={[style, { opacity: 0 }]}>
                {children}
            </View>
        );
    }

    return (
        <MaskedView
            maskElement={children}
            onLayout={onLayout}
            style={[{ width: layout.width, height: layout.height, overflow: "hidden" }, style]}>
            {/* Background base */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]} />

            {/* Animated shimmer beam */}
            <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
                <MaskedView
                    style={StyleSheet.absoluteFill}
                    maskElement={
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                            colors={["transparent", "black", "transparent"]}
                        />
                    }>
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: hl }]} />
                </MaskedView>
            </Animated.View>
        </MaskedView>
    );
};

export default SkeletonWrapper;

