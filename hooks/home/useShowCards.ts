import {CardData} from "@/types/data";
import {
    Ban,
    Calendar,
    CalendarCheck2,
    CheckSquare,
    DollarSign,
    IdCard,
    Landmark,
    Megaphone,
    NotepadText,
    Pin,
    User,
    X,
} from "lucide-react";
import {useDashboardStatistics} from "./useDashboardStatistics";

const useShowCards = () => {
    const {data, isLoading} = useDashboardStatistics();

    const cardData: CardData[] = [
        {
            id: 1,
            name: "المستخدمين",
            icon: User,
            value: data?.numberUsers || 0,
        },
        {
            id: 2,
            name: "الأقسام",
            icon: NotepadText,
            value: data?.numberDepartments || 0,
        },
        {
            id: 3,
            name: "الأطباء",
            icon: IdCard,
            value: data?.numberDoctors || 0,
        },
        {
            id: 4,
            name: "الإعلانات",
            icon: Megaphone,
            value: data?.numberAds || 0,
        },
        {
            id: 5,
            name: "الأرباح الكلية",
            icon: Landmark,
            value: data?.totalRevenue || 0,
        },
        {
            id: 6,
            name: "أرباح هذا الشهر",
            icon: DollarSign,
            value: data?.monthlyRevenue || 0,
        },
        {
            id: 7,
            name: "كل الحجوزات",
            icon: Calendar,
            value: data?.numberAppointments || 0,
        },
        {
            id: 8,
            name: "حجوزات هذا الشهر",
            icon: CalendarCheck2,
            value: data?.appointmentsThisMonth || 0,
        },
        {
            id: 9,
            name: "الحجوزات المقبولة",
            icon: CheckSquare,
            value: data?.acceptedAppointments || 0,
        },
        {
            id: 10,
            name: "الحجوزات قيد المراجعة",
            icon: Pin,
            value: data?.pendingAppointments || 0,
        },
        {
            id: 11,
            name: "الحجوزات المرفوضة",
            icon: Ban,
            value: data?.rejectedAppointments || 0,
        },
        {
            id: 12,
            name: "الحجوزات الملغية",
            icon: X,
            value: data?.cancelledAppointments || 0,
        },
    ];

    return {cardData, isLoading};
};

export default useShowCards;
