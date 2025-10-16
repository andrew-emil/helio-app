export function getTranslatedCateoryName(categoryName: string): string {
    switch (categoryName) {
        case "activities":
            return "أنشطة و فعاليات";
        case "beauty":
            return "الجمال و العناية الشخصية";
        case "education":
            return "التعليم";
        case "finishing":
            return "التشطيبات";
        case "fitness":
            return "اللياقة البدنية";
        case "food":
            return "المطاعم و  المقاهى";
        case "health":
            return "الصحة";
        case "home_services":
            return "الخدمات المنزلية";
        case "shopping":
            return "التسوق";
        case "technology":
            return "تكنولوجيا و اتصالات";
        case "others":
            return "خدمات آخرى";
        default:
            return categoryName;
    }
}
