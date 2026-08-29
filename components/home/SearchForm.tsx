import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";
import Icon from "@/components/ui/icons/Icon";
import { useThemeStore } from "@/store/theme.store";

interface SearchFormProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    placeholder = "ابحث عن طبيبك...",
    initialValue = "",
}) => {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const { isDark } = useThemeStore();

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <View className="relative flex-row items-center my-2">
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                className={`w-full rounded-2xl border pr-12 pl-4 py-4 text-base font-sans-medium ${
                    isDark
                        ? "bg-slate-800 text-white border-slate-700"
                        : "bg-background text-primary border-border"
                }`}
                style={{
                    textAlign: "right",
                }}
                placeholder={placeholder}
                placeholderTextColor={isDark ? "#94a3b8" : "rgba(0, 0, 0, 0.4)"}
            />
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSearch}
                className="absolute right-3.5 z-10 p-1 items-center justify-center"
            >
                <Icon
                    icon={icons.SearchIcon}
                    size={22}
                    className="text-muted-foreground dark:text-slate-400"
                    color={isDark ? "#94a3b8" : "#6b7280"}
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchForm;
