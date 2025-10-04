import { ServiceDocData } from "@/types/firebaseDocs.type";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ICON_COLOR = "#06b6d4";
const ICON_SIZE = 28;

export function getQuickAccessItemsFromServices(services: ServiceDocData[]) {
    const baseItems = [
        { title: "الطعام والشراب", icon: <Ionicons name="fast-food" size={ICON_SIZE} color={ICON_COLOR} />, categoryName: "الطعام والشراب" },
        { title: "الصحة", icon: <FontAwesome5 name="heartbeat" size={ICON_SIZE} color={ICON_COLOR} />, categoryName: "الصحة" },
        { title: "التسوق", icon: <MaterialCommunityIcons name="shopping" size={ICON_SIZE} color={ICON_COLOR} />, categoryName: "التسوق" },
        { title: "الصيانة", icon: <MaterialCommunityIcons name="wrench" size={ICON_SIZE} color={ICON_COLOR} />, categoryName: "الصيانه والخدمات المنزلية" },
    ];

    return baseItems.map(item => {

        const matchedService = services.find(s => s.category === item.categoryName);

        const firstSubCategory = matchedService?.subCategory;
        const to =
            `/(drawer)/category/${encodeURIComponent(firstSubCategory as string)}`

        return {
            ...item,
            to,
        };
    });
}
