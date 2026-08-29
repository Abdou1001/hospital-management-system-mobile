import React from "react";
import { View } from "react-native";
import TitleSection from "./TitleSection";
import ShowDepartments from "../departments/ShowDepartments";
import { icons } from "@/constants/icons";
import { useDepartments } from "@/hooks/departments/useDepartments";

const DepartmentSection = () => {
    const { data, isLoading } = useDepartments({ limit: 8 });

    const apiDepartments = Array.isArray(data)
        ? data
        : [];

    return (
        <View>
            <TitleSection title="الأقسام" path={"/(tabs)/departments"} icon={icons.departments} />
            <ShowDepartments data={apiDepartments} isLoading={isLoading} limit={8} />
        </View>
    );
};

export default DepartmentSection;


