import images from "@/constants/images";
import { useAds } from "@/hooks/ads/useAds";
import { useThemeStore } from "@/store/theme.store";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    View,
} from "react-native";
import AdImageModal from "./AdImageModal";

const CARD_HEIGHT = 300;

// إعلانات احتياطية في حال عدم توفر بيانات من السيرفر
const fallbackAds = [
    { id: "1", image: images.ad_1 },
    { id: "2", image: images.ad_2 },
    { id: "3", image: images.ad_3 },
    { id: "4", image: images.ad_2 },
];

export const getAdImageSource = (item: any) => {
    if (item.image && typeof item.image !== "string") {
        return item.image;
    }
    const path = item.image_url || item.path_image || item.image || item.url;
    if (typeof path === "string" && path.trim().length > 0) {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return { uri: path };
        }
        const baseUrl = process.env.EXPO_PUBLIC_STORAGE_URL || process.env.EXPO_PUBLIC_API_URL || "";
        const cleanBase = baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return { uri: `${cleanBase}${cleanPath}` };
    }
    return images.ad_1;
};

const HomeAds = () => {
    const { isDark } = useThemeStore();
    // جلب البيانات
    const { data, isLoading } = useAds();
    // للـModal
    const [selectedAd, setSelectedAd] = useState<any>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    // استخراج الإعلانات من البيانات القادمة من الداتابيس (data.results أو data.data أو الاحتياطية)
    const apiAds = Array.isArray(data?.results)
        ? data.results
        : [];

    const ads = apiAds.length > 0 ? apiAds : fallbackAds;

    // عرض الإعلان داخل الصفحة
    const CARD_WIDTH = containerWidth > 0 ? containerWidth - 16 : 0;

    /*
     * الانتقال التلقائي كل 5 ثوانٍ
     */
    useEffect(() => {
        if (ads.length <= 1 || containerWidth === 0 || selectedAd !== null) {
            return;
        }

        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex =
                    prevIndex === ads.length - 1 ? 0 : prevIndex + 1;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [ads.length, containerWidth, selectedAd]);

    /*
     * معرفة الإعلان الحالي بعد انتهاء السحب
     */
    const handleMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        if (containerWidth === 0) return;

        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / containerWidth);

        setActiveIndex(index);
    };

    /*
     * الضغط على الإعلان
     */
    const handlePress = (item: any) => {
        console.log("Clicked ad:", item);
        setSelectedAd(item);
    };

    if (isLoading && containerWidth > 0) {
        return (
            <View
                className="mt-3 justify-center items-center rounded-3xl bg-slate-100 dark:bg-slate-800/50"
                style={{ height: CARD_HEIGHT }}>
                <ActivityIndicator size="large" color={"#16a34a"} />
            </View>
        );
    }

    return (
        <>
            <View
                className="mt-3"
                onLayout={(event) => {
                    const width = event.nativeEvent.layout.width;
                    setContainerWidth(width);
                }}>
                {containerWidth > 0 && (
                    <FlatList
                        ref={flatListRef}
                        data={ads}
                        keyExtractor={(item, index) =>
                            String(item.ad_id || item.id || index)
                        }
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        onMomentumScrollEnd={handleMomentumScrollEnd}
                        renderItem={({item}) => (
                            <View
                                style={{
                                    width: containerWidth,
                                    alignItems: "center",
                                }}>
                                <Pressable
                                    onPress={() => handlePress(item)}
                                    className="overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800"
                                    style={{
                                        width: CARD_WIDTH,
                                        height: CARD_HEIGHT,
                                    }}>
                                    <Image
                                        source={getAdImageSource(item)}
                                        resizeMode="cover"
                                        className="size-full"
                                    />
                                </Pressable>
                            </View>
                        )}
                    />
                )}

                {/* مؤشرات الإعلانات */}
                {ads.length > 1 && (
                    <View className="mt-3 flex-row items-center justify-center gap-2">
                        {ads.map((_: any, index: number) => (
                            <View
                                key={index}
                                className={
                                    index === activeIndex
                                        ? `h-2 w-5 rounded-full ${isDark ? "bg-white" : "bg-muted-foreground"}`
                                        : `size-2 rounded-full ${isDark ? "bg-gray-400" : "bg-primary/20"}`
                                }
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* الموديل */}
            <AdImageModal ad={selectedAd} setSelectedAd={setSelectedAd} />
        </>
    );
};

export default HomeAds;

