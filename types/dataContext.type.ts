import { AdvertisementsDocData, NewsDocData, PropertyDocData, ServiceDocData } from "./firebaseDocs.type";

//  ✅ Common Types
export type ID = string; // Firestore IDs are always strings
export type TimestampString = string; // store dates as Firestore Timestamp.toDate().toISOString()

// ✅ News
export interface News {
    id: ID;
    title: string;
    content: string;
    imageUrl: string;
    date: TimestampString;
    author: string;
    externalUrl?: string;
    views: number;
}

// ✅ Notification
export interface Notification {
    id: ID;
    title: string;
    content: string;
    imageUrl?: string;
    externalUrl?: string;
    serviceId?: ID;
    startDate: TimestampString;
    endDate: TimestampString;
}

// ✅ Emergency Contact
export interface EmergencyContact {
    id: ID;
    title: string;
    number: string;
    type: 'city' | 'national';
}

// ✅ Service Guide
export interface ServiceGuide {
    id: ID;
    title: string;
    steps: string[];
    documents: string[];
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf';
}

// ✅ User
export type UserStatus = 'active' | 'pending' | 'banned' | 'deletion_requested';

export interface AppUser {
    id: ID;
    name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    joinDate: TimestampString;
    // ⚠️ password should never be stored in Firestore
}

// ✅ Admin User
export interface AdminUser {
    id: ID;
    name: string;
    email: string;
    avatar: string;
    role: 'مدير عام' | 'مسؤول ادارة الخدمات' | 'مسؤول العقارات' | 'مسؤول الاخبار والاعلانات والاشعارات' | 'مسؤول الباصات';
    // ⚠️ password should be handled by Firebase Auth, not Firestore
}

// ✅ Audit Log
export interface AuditLog {
    id: ID;
    user: string;
    action: string;
    details: string;
    timestamp: TimestampString;
}

// ✅ Transportation
export interface Driver {
    id: ID;
    name: string;
    phone: string;
    avatar: string;
}

export interface ScheduleDriver {
    name: string;
    phone: string;
}

export interface WeeklyScheduleItem {
    date: TimestampString;
    drivers: ScheduleDriver[];
}

export interface ExternalRoute {
    id: ID;
    name: string;
    timings: string[];
    waitingPoint: string;
}

export interface Supervisor {
    name: string;
    phone: string;
}

// ✅ Public Pages
export interface PolicySection {
    title: string;
    content: (string | { list: string[] })[];
}

export interface PolicyPageContent {
    title: string;
    lastUpdated: TimestampString;
    sections: PolicySection[];
}

export interface Advertisement {
    id: ID;
    title: string;
    imageUrl: string;
    serviceId?: ID;
    externalUrl?: string;
    startDate: TimestampString;
    endDate: TimestampString;
}

export interface PublicPagesContent {
    home: HomePageContent;
    about: AboutPageContent;
    faq: FaqPageContent;
    privacy: PolicyPageContent;
    terms: PolicyPageContent;
    aboutCity: AboutCityPageContent;
}

// ✅ Marketplace & Jobs
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface MarketplaceItem {
    id: ID;
    userId: ID;
    username: string;
    avatar: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    category: string;
    contactPhone: string;
    status: ListingStatus;
    creationDate: TimestampString;
    expirationDate: TimestampString;
    rejectionReason?: string;
}

export interface JobPosting {
    id: ID;
    userId: ID;
    username: string;
    avatar: string;
    title: string;
    companyName: string;
    description: string;
    location: string;
    type: 'دوام كامل' | 'دوام جزئي' | 'عقد' | 'تدريب';
    contactInfo: string;
    status: ListingStatus;
    creationDate: TimestampString;
    expirationDate: TimestampString;
    rejectionReason?: string;
}

// ✅ About City
export interface AboutCityPageContent {
    city: {
        mainParagraphs: string[];
        planning: string;
        roads: string;
        utilities: string;
    };
    company: {
        about: string;
        vision: string;
        mission: string;
        data: { label: string; value: string }[];
    };
    board: BoardMember[];
}

// ✅ Reviews
export interface Review {
    id: ID;
    userId: ID;
    username: string;
    avatar: string;
    rating: number;
    comment: string;
    date: TimestampString;
    adminReply?: string;
    helpfulCount?: number;
}

// ✅ Services
export interface Service {
    id: ID;
    subCategoryId: ID;
    name: string;
    images: string[];
    address: string;
    phone: string[];
    whatsapp: string[];
    about: string;
    rating: number;
    reviews: Review[];
    facebookUrl?: string;
    instagramUrl?: string;
    locationUrl?: string;
    workingHours?: string;
    isFavorite: boolean;
    views: number;
    creationDate: TimestampString;
}

export interface SubCategory {
    id: ID;
    name: string;
}

export interface Category {
    id: ID;
    name: string;
    icon: string;
    subCategories: SubCategory[];
}

// ✅ Properties
export interface Property {
    id: ID;
    title: string;
    description: string;
    images: string[];
    location: { address: string };
    type: 'sale' | 'rent';
    price: number;
    contact: { name: string; phone: string };
    amenities: string[];
    views: number;
    creationDate: TimestampString;
}

// ✅ FAQ / About / Home
export interface FaqItem {
    q: string;
    a: string;
}

export interface FaqCategory {
    category: string;
    items: FaqItem[];
}

export interface FaqPageContent {
    title: string;
    subtitle: string;
    categories: FaqCategory[];
}

export interface AboutPageContent {
    title: string;
    intro: string;
    vision: { title: string; text: string };
    mission: { title: string; text: string };
}

export interface HomePageFeature {
    title: string;
    description: string;
}

export interface HomePageContent {
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    featuresSectionTitle: string;
    featuresSectionSubtitle: string;
    features: HomePageFeature[];
    infoLinksSectionTitle: string;
}

export interface BoardMember {
    name: string;
    title: string;
    email?: string;
    details: string[];
}


export interface DataContextType {
    // data
    services: ServiceDocData[];
    news: NewsDocData[];
    advertisements: AdvertisementsDocData[];
    properties: PropertyDocData[];

    // saves
    handleSaveService: (item: Partial<ServiceDocData> & { id?: string }) => void;
    handleSaveNews: (item: Partial<NewsDocData> & { id?: string }) => void;
    handleSaveAdvertisement: (item: Partial<Advertisement> & { id?: string }) => void;
    handleSaveProperty: (item: Partial<Property> & { id?: string }) => void;

    // deletes (optional but handy)
    handleDeleteService: (id: string) => void;
    handleDeleteNews: (id: string) => void;
    handleDeleteAdvertisement: (id: string) => void;
    handleDeleteProperty: (id: string) => void;

    saveInitialData: (payload: {
        services?: ServiceDocData[] | undefined;
        news?: NewsDocData[];
        advertisements?: AdvertisementsDocData[];
        properties?: PropertyDocData[];
    }) => Promise<void>
}