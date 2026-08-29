import {icons} from "@/constants/icons";
import React from "react";
import {View} from "react-native";
import TitleSection from "./TitleSection";
import ShowDoctors from "../doctors/ShowDoctors";
import { useDoctors } from "@/hooks/doctors/useDoctors";

const DoctorSection = () => {
    const { data, isLoading } = useDoctors({ limit: 8 });
    
        const apiDoctors = Array.isArray(data?.results) ? data.results : [];
        
    return (
        <View className="mt-5">
            <TitleSection
                title="الاطباء"
                path={"/(tabs)/doctors"}
                icon={icons.doctors}
            />

            <ShowDoctors data={apiDoctors} isLoading={isLoading} limit={4} />
        </View>
    );
};

export default DoctorSection;
