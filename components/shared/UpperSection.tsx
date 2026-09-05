import React, { memo } from "react";
import HomeHeader from "../home/HomeHeader";
import SearchBar, { SearchBarProps } from "./SearchBar";

export interface UpperSectionProps extends SearchBarProps {
    showSearch?: boolean;
}

const UpperSection: React.FC<UpperSectionProps> = ({
    showSearch = true,
    placeholder = "ابحث عن طبيبك...",
    value,
    onChangeText,
    onClear,
    onSubmit,
    isLoading,
}) => {
    return (
        <>
            {/* Header */}
            <HomeHeader />

            {/* Search */}
            {showSearch && (
                <SearchBar
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onClear={onClear}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default memo(UpperSection);
