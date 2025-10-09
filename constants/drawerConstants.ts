import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import React from 'react';

export const drawerSections = [
    // First section - Main features
    [
        { name: "tabs", label: "الرئيسية", icon: ({ color }: { color: string }) => React.createElement(Ionicons, { name: "home", size: 22, color }) },
        { name: "favorites", label: "المفضلة", icon: () => React.createElement(Ionicons, { name: "heart-outline", size: 22, color: "red" }) },
    ],
    // SEPARATOR 1
    // Second section
    [
        { name: "news", label: "الأخبار", icon: () => React.createElement(Ionicons, { name: "newspaper-outline", size: 22, color: "#2F3868" }) },
        { name: "community", label: "المجتمع", icon: () => React.createElement(Ionicons, { name: "chatbubble-ellipses-outline", size: 22, color: "#1C384B" }) },
        { name: "market", label: "البيع و الشراء", icon: () => React.createElement(FontAwesome, { name: "shopping-bag", size: 22, color: "yellow" }) },
        { name: "jobs", label: "الوظائف", icon: () => React.createElement(Ionicons, { name: "briefcase-outline", size: 22, color: "#84CC16" }) },
    ],
    // SEPARATOR 2
    // Second section - Services
    [
        { name: "transportation", label: "المواصلات", icon: () => React.createElement(FontAwesome6, { name: "truck", size: 22, color: "#5F4892" }) },
        { name: "cityAgencyServices", label: "خدمات جهاز المدينة", icon: () => React.createElement(Ionicons, { name: "documents-outline", size: 22, color: "#0EA5E9" }) },
    ],
    // SEPARATOR 3
    // Third section - Information
    [
        { name: "about", label: "من نحن", icon: ({ color }: { color: string }) => React.createElement(Ionicons, { name: "information-circle", size: 22, color }) },
        { name: "Contact", label: "اتصل بنا", icon: ({ color }: { color: string }) => React.createElement(Ionicons, { name: "call", size: 22, color }) },
        { name: "faq", label: "الأسئلة الشائعة", icon: ({ color }: { color: string }) => React.createElement(Ionicons, { name: "help-circle", size: 22, color }) },
    ]
];