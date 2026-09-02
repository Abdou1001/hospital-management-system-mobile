import { icons } from "@/constants/icons";
import { useDepartments } from "@/hooks/departments/useDepartments";
import React from "react";
import { View } from "react-native";
import ShowDepartments from "../departments/ShowDepartments";
import TitleSection from "./TitleSection";

const DepartmentSection = () => {
    const { data, isLoading } = useDepartments({ limit: 8 });

    const apiDepartments =
        data?.pages.flatMap((page) => page.results) ?? [];

    return (
        <View>
            <TitleSection title="الأقسام" path={"/(tabs)/departments"} icon={icons.departments} />
            <ShowDepartments data={apiDepartments} isLoading={isLoading} limit={8} />
        </View>
    );
};

export default DepartmentSection;


