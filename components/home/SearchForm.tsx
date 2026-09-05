import React, { memo } from "react";
import SearchBar, { SearchBarProps } from "@/components/shared/SearchBar";

const SearchForm: React.FC<SearchBarProps> = (props) => {
    return <SearchBar placeholder="ابحث عن طبيبك..." {...props} />;
};

export default memo(SearchForm);
