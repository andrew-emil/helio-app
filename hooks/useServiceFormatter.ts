// hooks/useFormattedServices.ts
import { useData } from "@/context/dataContext";
import { useMemo } from "react";

export interface FormattedService {
    id: string;
    address: string;
    category: string;
    createdAt: Date;
    description: string;
    externalLink?: string;
    imageUrl: string[];
    name: string;
    phone: string;
    secondPhone?: string;
    subCategory: string;
    whatsapp: string;
    workTime?: string;
}

export interface ServiceSubCategory {
    subCategoryName: string;
    services: FormattedService[];
}

export interface ServiceCategory {
    categoryName: string;
    subCategories: ServiceSubCategory[];
}

export function useFormattedServices(): ServiceCategory[] {
    const { services } = useData();

    const formattedServices = useMemo(() => {
        if (!services || services.length === 0) {
            return [];
        }

        // Group by category first
        const categoriesMap = services.reduce((acc, service) => {
            const { category, subCategory } = service;

            if (!acc[category]) {
                acc[category] = {};
            }

            if (!acc[category][subCategory]) {
                acc[category][subCategory] = [];
            }

            acc[category][subCategory].push(service);
            return acc;
        }, {} as Record<string, Record<string, FormattedService[]>>);

        // Convert to the desired array structure
        const formattedCategories: ServiceCategory[] = Object.entries(categoriesMap).map(([categoryName, subCategoriesMap]) => {
            const subCategories: ServiceSubCategory[] = Object.entries(subCategoriesMap).map(([subCategoryName, services]) => ({
                subCategoryName,
                services: services.sort((a, b) => a.name.localeCompare(b.name))
            }));

            return {
                categoryName,
                subCategories: subCategories.sort((a, b) => a.subCategoryName.localeCompare(b.subCategoryName))
            };
        });

        return formattedCategories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
    }, [services]);

    return formattedServices;
}