import Spinner from '@/components/Spinner';
import { getAllServices } from '@/services/firebase/services';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
    AcademicCapIcon,
    ArrowLeftIcon,
    BoltIcon,
    CakeIcon,
    CarIcon,
    ChevronDownIcon,
    DevicePhoneMobileIcon,
    GiftIcon,
    HeartIcon,
    PaintBrushIcon,
    RectangleGroupIcon,
    ShoppingBagIcon,
    SparklesIcon,
    Squares2X2Icon,
    WrenchScrewdriverIcon
} from '../components/common/Icons';
import { getTranslatedCateoryName } from '@/utils/getTranslatedCategoryName';

const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    HeartIcon,
    CakeIcon,
    AcademicCapIcon,
    ShoppingBagIcon,
    DevicePhoneMobileIcon,
    BoltIcon,
    SparklesIcon,
    WrenchScrewdriverIcon,
    CarIcon,
    Squares2X2Icon,
    GiftIcon,
    PaintBrushIcon
};

const getIcon = (name: string, props: React.SVGProps<SVGElement>) => {
    const IconComponent = iconComponents[name];
    // @ts-ignore (SVG props typing fallback)
    return IconComponent ? <IconComponent {...(props as any)} /> : <Squares2X2Icon {...(props as any)} />;
};


// local types (adjust ServiceDocData to your actual type if available)
type ServicesByCategoryArray = Record<string, { subCategory: string; services: any[] }[]>;

type SubCategoryData = {
    id: string;
    name: string;
    count: number;
};

type CategoryData = {
    id: number;
    nameEn: string;         // original English key (for icons / linking)
    nameAr: string;         // translated Arabic display name
    icon: string;
    totalCount: number;
    subCategories: SubCategoryData[];
};

const ServicesOverviewPage: React.FC = () => {
    const navigate = useNavigate();

    // expanded category id
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    // window width for responsive adjustments
    const [width, setWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const { data: servicesRaw, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: async () => await getAllServices()
    });

    // keep a safe object while loading/if undefined
    const services: ServicesByCategoryArray = (servicesRaw ?? {}) as ServicesByCategoryArray;

    // small-screen breakpoint (matches tailwind lg ~ 1024)
    const isSmall = width < 1024;

    // chart data: { name: translated, value } and filter zero values
    const chartData = useMemo(() => {
        return Object.entries(services)
            .map(([categoryName, subCategories]) => {
                const totalServices = subCategories.reduce((sum, sub) => sum + (sub.services?.length ?? 0), 0);
                return { name: getTranslatedCateoryName(categoryName), value: totalServices, id: categoryName };
            })
            .filter(entry => entry.value > 0);
    }, [services]);

    // category list data (translated for display, keep english key for icon lookup)
    const categoryData: CategoryData[] = useMemo(() => {
        return Object.entries(services)
            .map(([categoryName, subCategories], catIndex) => {
                const subs: SubCategoryData[] = subCategories.map((sub, subIndex) => ({
                    id: `${categoryName}-${encodeURIComponent(sub.subCategory)}-${subIndex}`,
                    name: sub.subCategory,
                    count: sub.services?.length ?? 0
                }));

                const totalCount = subs.reduce((s, sub) => s + sub.count, 0);

                return {
                    id: catIndex + 1,
                    nameEn: categoryName,
                    nameAr: getTranslatedCateoryName(categoryName),
                    icon: categoryName,
                    totalCount,
                    subCategories: subs
                };
            })
            .filter(cat => cat.totalCount > 0);
    }, [services]);

    if (isLoading) return <Spinner />;

    const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

    const handleToggleCategory = (id: number) => {
        setOpenCategoryId(openCategoryId === id ? null : id);
    };

    // smaller pie for small screens, and hide legend to avoid overlap
    const chartHeight = isSmall ? 240 : 300;
    const outerRadius = isSmall ? 70 : 100;

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <RectangleGroupIcon className="w-8 h-8" />
                هيكل الخدمات
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pie chart */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">توزيع الخدمات</h2>

                    {chartData.length === 0 ? (
                        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-300">
                            لا توجد خدمات لعرضها
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={chartHeight}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={outerRadius}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine
                                    
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Tooltip
                                    // tooltip shows the translated name and value
                                    formatter={(value: any, name: any, props: any) => [value, name]}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                                />

                                {/* hide legend on small screens to avoid overlap */}
                                {!isSmall && <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: -10, top: 20 }} />}
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Category list */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">قائمة الفئات التفصيلية</h2>

                    <div className="space-y-2">
                        {categoryData.map(category => (
                            <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                <button
                                    onClick={() => handleToggleCategory(category.id)}
                                    className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-right gap-2"
                                >
                                    <div className="flex items-center gap-3 w-full lg:w-auto">
                                        {/* icon lookup uses English key */}
                                        {getIcon(category.nameEn, { className: "w-6 h-6 text-cyan-500" } as any)}
                                        <span className="font-semibold text-lg text-gray-800 dark:text-white">{category.nameAr}</span>
                                        <span className="text-sm font-mono px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full ml-2">{category.totalCount}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 lg:mt-0">
                                        {/* optional small indicator of subcategories count */}
                                        <span className="text-sm text-gray-500 dark:text-gray-300 hidden lg:inline">{category.subCategories.length} sub</span>
                                        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openCategoryId === category.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategoryId === category.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                    <ul className="p-4 pr-12 space-y-2">
                                        {category.subCategories.map(sub => (
                                            <li key={sub.id}>
                                                <Link to={`/services/subcategory/${encodeURIComponent(sub.id)}`} className="flex justify-between items-center p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                                    <span className="text-gray-700 dark:text-gray-300">{sub.name}</span>
                                                    <span className="font-bold font-mono text-lg text-cyan-600 dark:text-cyan-400">{sub.count}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        {categoryData.length === 0 && (
                            <div className="text-center p-6 text-gray-500 dark:text-gray-400">لا توجد فئات تحتوي على خدمات.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesOverviewPage;
