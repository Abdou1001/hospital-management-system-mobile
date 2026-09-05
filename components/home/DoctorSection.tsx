import { icons } from "@/constants/icons";
import React, { memo, useMemo } from "react";
import { View } from "react-native";
import TitleSection from "./TitleSection";
import ShowDoctors from "../doctors/ShowDoctors";
import { useDoctors } from "@/hooks/doctors/useDoctors";

interface DoctorSectionProps {
    keyword?: string;
}

const DoctorSection: React.FC<DoctorSectionProps> = ({ keyword }) => {
    const queryParams = useMemo(() => {
        const trimmed = keyword?.trim();
        return {
            limit: 8,
            ...(trimmed ? { keyword: trimmed } : {}),
        };
    }, [keyword]);

    const { data, isLoading } = useDoctors(queryParams);

    const apiDoctors = useMemo(
        () => data?.pages.flatMap((page) => page.results) ?? [],
        [data]
    );

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

export default memo(DoctorSection);
