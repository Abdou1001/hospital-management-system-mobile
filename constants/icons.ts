import appointments from "@/assets/icons/appointments.svg";
import back from "@/assets/icons/back.png";
import bell from "@/assets/icons/bell.svg";
import departments from "@/assets/icons/departments.svg";
import doctors from "@/assets/icons/doctors.svg";
import home from "@/assets/icons/home.svg";
import leftArrow from "@/assets/icons/left-arrow.svg";
import logo from "@/assets/icons/logo.png";
import moon from "@/assets/icons/moon.svg";
import SearchIcon from "@/assets/icons/search.svg";
import setting from "@/assets/icons/setting.svg";
import sun from "@/assets/icons/sun.svg";

export const icons = {
    home,
    departments,
    doctors,
    setting,
    logo,
    back,
    appointments,
    SearchIcon,
    moon,
    sun,
    bell,
    leftArrow,
} as const;

export type IconKey = keyof typeof icons;
