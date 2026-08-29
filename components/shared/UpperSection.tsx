import { User } from "@/validation/users/schemas/user.schema";
import React from "react";
import HomeHeader from "../home/HomeHeader";
import SearchForm from "../home/SearchForm";

const UpperSection = () => {
    return (
        <>
            {/* Header */}
            <HomeHeader />

            {/* Search */}
            <SearchForm />
        </>
    );
};

export default UpperSection;
