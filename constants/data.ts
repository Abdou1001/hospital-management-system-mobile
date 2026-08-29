import {icons} from "./icons";
import images from "./images";

export const tabs: AppTab[] = [
    {name: "index", title: "الرئسية", icon: icons.home},
    {name: "departments", title: "الاقسام", icon: icons.departments},
    {name: "doctors", title: "الاطباء", icon: icons.doctors},
    {name: "appointments", title: "حجوزاتي", icon: icons.appointments},
    {name: "settings", title: "الاعدادات", icon: icons.setting},
];


export const DoctorsData: DoctorsItem[] = [
    {id: "1", name: "علي سعيد باسيعد", bio: "قام بعمليات كثيرة" , image: images.maleDoctor},
    {id: "2", name: "عبدالرحمن احمد محمد يسلم بن سعد",bio: "قام بعمليات كثيرة", image: images.maleDoctor},
    {id: "3", name: "عمر محمد سبيدان العوبثاني",bio: "قام بعمليات كثيرة", image: images.maleDoctor},
    {id: "4", name: "محمد بكري باسودان",bio: "قام بعمليات كثيرة", image: images.maleDoctor},
];

