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
    // Services & Categories
    categories: Category[];
    services: Service[];

    // Service methods
    handleSaveService: (
        serviceData: Omit<
            Service,
            'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'
        > & { id?: string }
    ) => void;
    handleDeleteService: (serviceId: string) => void;
    handleToggleFavorite: (serviceId: string) => void;

    // Review methods
    handleToggleHelpfulReview: (serviceId: string, reviewId: string) => void;
    addReview: (
        serviceId: string,
        reviewData: Omit<
            Review,
            'id' | 'date' | 'adminReply' | 'username' | 'avatar' | 'userId'
        >
    ) => void;
    handleUpdateReview: (serviceId: string, reviewId: string, comment: string) => void;
    handleDeleteReview: (serviceId: string, reviewId: string) => void;
    handleReplyToReview: (serviceId: string, reviewId: string, reply: string) => void;

    // Properties
    properties: Property[];
    handleSaveProperty: (
        property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: string }
    ) => void;
    handleDeleteProperty: (propertyId: string) => void;

    // Other Data
    news: News[];
    notifications: Notification[];
    advertisements: Advertisement[];
    emergencyContacts: EmergencyContact[];
    serviceGuides: ServiceGuide[];
    users: AppUser[];
    admins: AdminUser[];
    auditLogs: AuditLog[];

    // Transportation
    transportation: {
        internalSupervisor: Supervisor;
        externalSupervisor: Supervisor;
        internalDrivers: Driver[];
        weeklySchedule: WeeklyScheduleItem[];
        externalRoutes: ExternalRoute[];
    };

    publicPagesContent: PublicPagesContent;
    marketplaceItems: MarketplaceItem[];
    jobPostings: JobPosting[];

    // User methods
    requestAccountDeletion: (userId: string) => void;
    handleSaveUser: (
        userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: string }
    ) => void;
    handleDeleteUser: (userId: string) => void;

    // Admin methods
    handleSaveAdmin: (adminData: Omit<AdminUser, 'id'> & { id?: string }) => void;
    handleDeleteAdmin: (adminId: string) => void;

    // Other entity methods
    handleSaveNews: (
        newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: string }
    ) => void;
    handleDeleteNews: (newsId: string) => void;
    handleSaveNotification: (notification: Omit<Notification, 'id'> & { id?: string }) => void;
    handleDeleteNotification: (notificationId: string) => void;
    handleSaveAdvertisement: (ad: Omit<Advertisement, 'id'> & { id?: string }) => void;
    handleDeleteAdvertisement: (adId: string) => void;
    handleSaveEmergencyContact: (contact: Omit<EmergencyContact, 'id'> & { id?: string }) => void;
    handleDeleteEmergencyContact: (contactId: string) => void;
    handleSaveServiceGuide: (guide: Omit<ServiceGuide, 'id'> & { id?: string }) => void;
    handleDeleteServiceGuide: (guideId: string) => void;

    // Transportation methods
    handleSaveSupervisor: (type: 'internal' | 'external', supervisor: Supervisor) => void;
    handleSaveDriver: (driver: Omit<Driver, 'id'> & { id?: string }) => void;
    handleDeleteDriver: (driverId: string) => void;
    handleSaveRoute: (route: Omit<ExternalRoute, 'id'> & { id?: string }) => void;
    handleDeleteRoute: (routeId: string) => void;
    handleSaveSchedule: (schedule: WeeklyScheduleItem[]) => void;

    // Content Management methods
    handleUpdatePublicPageContent: <K extends keyof PublicPagesContent>(
        page: K,
        content: PublicPagesContent[K]
    ) => void;

    // Marketplace methods
    handleSaveMarketplaceItem: (
        item: Omit<
            MarketplaceItem,
            | 'id'
            | 'status'
            | 'creationDate'
            | 'expirationDate'
            | 'userId'
            | 'username'
            | 'avatar'
        > & { id?: string; duration: number }
    ) => void;
    handleDeleteMarketplaceItem: (itemId: string) => void;
    handleUpdateMarketplaceItemStatus: (itemId: string, status: ListingStatus, rejectionReason?: string) => void;

    // Job methods
    handleSaveJobPosting: (
        job: Omit<
            JobPosting,
            | 'id'
            | 'status'
            | 'creationDate'
            | 'expirationDate'
            | 'userId'
            | 'username'
            | 'avatar'
        > & { id?: string; duration: number }
    ) => void;
    handleDeleteJobPosting: (jobId: string) => void;
    handleUpdateJobPostingStatus: (jobId: string, status: ListingStatus, rejectionReason?: string) => void;
}
