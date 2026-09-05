import Icon from "@/components/ui/icons/Icon";
import { icons } from "@/constants/icons";
import { useThemeStore } from "@/store/theme.store";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    TextInput,
    View,
} from "react-native";

export interface SearchBarProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
    autoFocus?: boolean;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value = "",
    onChangeText,
    placeholder = "ابحث هنا...",
    onClear,
    onSubmit,
    isLoading = false,
    autoFocus = false,
    className = "",
}) => {
    const { isDark } = useThemeStore();

    const handleClear = () => {
        if (onChangeText) {
            onChangeText("");
        }
        if (onClear) {
            onClear();
        }
    };

    const handleSubmit = () => {
        Keyboard.dismiss();
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <View className={`relative flex-row items-center my-2 ${className}`}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                autoFocus={autoFocus}
                className={`w-full rounded-2xl border pr-12 pl-12 py-3.5 text-base font-sans-medium ${
                    isDark
                        ? "bg-slate-800 text-white border-slate-700 focus:border-main"
                        : "bg-background text-primary border-border focus:border-main"
                }`}
                style={{
                    textAlign: "right",
                }}
                placeholder={placeholder}
                placeholderTextColor={
                    isDark ? "#94a3b8" : "rgba(0, 0, 0, 0.4)"
                }
            />

            {/* أيقونة البحث في اليمين */}
            <Pressable
                onPress={handleSubmit}
                className="absolute right-3.5 z-10 p-1 items-center justify-center">
                <Icon
                    icon={icons.SearchIcon}
                    size={22}
                    className="text-muted-foreground dark:text-slate-400"
                    color={isDark ? "#94a3b8" : "#6b7280"}
                />
            </Pressable>

            {/* أيقونة مسح النص أو مؤشر التحميل في اليسار */}
            <View className="absolute left-3.5 z-10 flex-row items-center">
                {isLoading ? (
                    <ActivityIndicator size="small" color="#10b981" />
                ) : value.length > 0 ? (
                    <Pressable
                        onPress={handleClear}
                        hitSlop={8}
                        className="p-1 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-700">
                        <Ionicons
                            name="close"
                            size={16}
                            color={isDark ? "#cbd5e1" : "#64748b"}
                        />
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
};

export default memo(SearchBar);
