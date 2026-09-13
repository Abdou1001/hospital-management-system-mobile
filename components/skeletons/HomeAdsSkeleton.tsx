import React from "react";
import { View } from "react-native";
import SkeletonWrapper from "./SkeletonWrapper";

interface HomeAdsSkeletonProps {
    width?: number;
    height?: number;
}

export const HomeAdsSkeleton: React.FC<HomeAdsSkeletonProps> = ({
    width,
    height = 160,
}) => {
    return (
        <View className="mt-3 w-full">
            <SkeletonWrapper>
                <View className="w-full">
                    {/* Main Banner Card */}
                    <View
                        style={{
                            width: width || "100%",
                            height: height,
                            borderRadius: 24,
                            backgroundColor: "#000",
                        }}
                    />

                    {/* Pagination Dots */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 12,
                            gap: 8,
                        }}>
                        <View
                            style={{
                                width: 20,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#000",
                            }}
                        />
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#000",
                            }}
                        />
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#000",
                            }}
                        />
                    </View>
                </View>
            </SkeletonWrapper>
        </View>
    );
};

export default HomeAdsSkeleton;
