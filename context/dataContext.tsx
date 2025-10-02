import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type {
    News, Notification,
    EmergencyContact, ServiceGuide, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    PublicPagesContent,
    Advertisement, DataContextType, AuditLog,
    MarketplaceItem, JobPosting, ListingStatus,
    Service, Category, Review, Property
} from '@/types/dataContext.type';
import { useUser } from './userContext';
import { useToast } from './toastContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Improved ID generator with better fallback
const genId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback: timestamp + random string
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Enhanced default public pages content
const DEFAULT_PUBLIC_PAGES_CONTENT: PublicPagesContent = {
    home: {
        heroTitleLine1: 'مرحباً بكم',
        heroTitleLine2: 'في مدينتنا',
        heroSubtitle: 'منصة الخدمات الإلكترونية',
        featuresSectionTitle: 'خدماتنا',
        featuresSectionSubtitle: 'اكتشف جميع الخدمات المتاحة',
        features: [],
        infoLinksSectionTitle: 'روابط مهمة',
    },
    about: {
        title: 'من نحن',
        intro: 'نحن نعمل من أجلكم',
        vision: { title: 'رؤيتنا', text: '' },
        mission: { title: 'مهمتنا', text: '' },
    },
    faq: {
        title: 'الأسئلة الشائعة',
        subtitle: 'إجابات على أسئلتك',
        categories: [],
    },
    privacy: {
        title: 'سياسة الخصوصية',
        lastUpdated: new Date().toISOString(),
        sections: [],
    },
    terms: {
        title: 'شروط الخدمة',
        lastUpdated: new Date().toISOString(),
        sections: [],
    },
    aboutCity: {
        city: {
            mainParagraphs: [],
            planning: '',
            roads: '',
            utilities: '',
        },
        company: {
            about: '',
            vision: '',
            mission: '',
            data: [],
        },
        board: [],
    },
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();
    const { user } = useUser();

    // Services & Properties State
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);

    // Other State
    const [news, setNews] = useState<News[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(DEFAULT_PUBLIC_PAGES_CONTENT);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>({ name: '', phone: '' });
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>({ name: '', phone: '' });
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>([]);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>([]);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>([]);

    // Load initial data from localStorage on mount
    useEffect(() => {
        const loadInitialData = () => {
            try {
                // You can add localStorage loading here if needed
                // Example: const savedServices = localStorage.getItem('services');
                // if (savedServices) setServices(JSON.parse(savedServices));
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        loadInitialData();
    }, []);

    // Save data to localStorage when it changes (optional)
    useEffect(() => {
        // Example: localStorage.setItem('services', JSON.stringify(services));
    }, [services]);

    // --- IMPROVED GENERIC HELPERS ---
    const genericSave = useCallback(<T extends { id?: string }>(
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        newItemData: Partial<T> & { id?: string },
        defaults: Partial<Omit<T, 'id'>>,
        itemName: string,
        successMessage?: string
    ) => {
        setItems(prev => {
            if (newItemData.id) {
                // Update existing item
                const updated = prev.map(item =>
                    item.id === newItemData.id
                        ? { ...item, ...newItemData, updatedAt: new Date().toISOString() }
                        : item
                );
                showToast(successMessage || `تم تحديث ${itemName} بنجاح`);
                return updated;
            } else {
                // Add new item
                const newItem: T = {
                    ...defaults,
                    ...newItemData,
                    id: genId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                } as unknown as T;
                showToast(successMessage || `تمت إضافة ${itemName} بنجاح`);
                return [newItem, ...prev];
            }
        });
    }, [showToast]);

    const genericDelete = useCallback(<T extends { id: string }>(
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        itemId: string,
        itemName: string
    ) => {
        setItems(prev => {
            const filtered = prev.filter(item => item.id !== itemId);
            showToast(`تم حذف ${itemName} بنجاح`);
            return filtered;
        });
    }, [showToast]);

    // --- ENHANCED SERVICES & REVIEWS HANDLERS ---
    const handleSaveService = useCallback((serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: string }) => {
        const defaults: Partial<Service> = {
            rating: 0,
            reviews: [],
            isFavorite: false,
            views: 0,
            creationDate: new Date().toISOString(),
        };

        genericSave<Service>(
            setServices,
            serviceData,
            defaults,
            'الخدمة',
            serviceData.id ? 'تم تحديث الخدمة بنجاح!' : 'تمت إضافة الخدمة بنجاح!'
        );
    }, [genericSave]);

    const handleDeleteService = useCallback((serviceId: string) => {
        genericDelete(setServices, serviceId, 'الخدمة');
    }, [genericDelete]);

    const handleToggleFavorite = useCallback((serviceId: string) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId
                ? { ...s, isFavorite: !s.isFavorite, updatedAt: new Date().toISOString() }
                : s
        ));
    }, []);

    const handleToggleHelpfulReview = useCallback((serviceId: string, reviewId: string) => {
        setServices(prevServices =>
            prevServices.map(s => {
                if (s.id === serviceId) {
                    const updatedReviews = s.reviews.map((r: Review) =>
                        r.id === reviewId
                            ? {
                                ...r,
                                helpfulCount: (r.helpfulCount || 0) + 1,
                                updatedAt: new Date().toISOString()
                            }
                            : r
                    );

                    // Recalculate average rating
                    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

                    return {
                        ...s,
                        reviews: updatedReviews,
                        rating: parseFloat(averageRating.toFixed(1)),
                        updatedAt: new Date().toISOString()
                    };
                }
                return s;
            })
        );
        showToast('شكراً لملاحظاتك!');
    }, [showToast]);

    const addReview = useCallback((serviceId: string, reviewData: Omit<Review, 'id' | 'date' | 'adminReply' | 'username' | 'avatar' | 'userId'>) => {
        if (!user) {
            showToast('يجب تسجيل الدخول لإضافة تقييم.', 'error');
            return;
        }

        const newReview: Review = {
            id: genId(),
            userId: user.uid,
            username: user.username || 'مستخدم',
            avatar: user.imageUrl || '',
            ...reviewData,
            date: new Date().toISOString(),
            helpfulCount: 0,
        };

        setServices(prev => prev.map(s => {
            if (s.id === serviceId) {
                const updatedReviews = [newReview, ...s.reviews];

                // Recalculate average rating
                const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

                return {
                    ...s,
                    reviews: updatedReviews,
                    rating: parseFloat(averageRating.toFixed(1)),
                    updatedAt: new Date().toISOString()
                };
            }
            return s;
        }));

        showToast('شكراً لك، تم إضافة تقييمك بنجاح!');
    }, [user, showToast]);

    const handleUpdateReview = useCallback((serviceId: string, reviewId: string, comment: string) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId
                ? {
                    ...s,
                    reviews: s.reviews.map((r: Review) =>
                        r.id === reviewId
                            ? { ...r, comment, updatedAt: new Date().toISOString() }
                            : r
                    ),
                    updatedAt: new Date().toISOString()
                }
                : s
        ));
        showToast('تم تحديث التقييم بنجاح');
    }, [showToast]);

    const handleDeleteReview = useCallback((serviceId: string, reviewId: string) => {
        setServices(prev => prev.map(s => {
            if (s.id === serviceId) {
                const updatedReviews = s.reviews.filter((r: Review) => r.id !== reviewId);

                // Recalculate average rating
                const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

                return {
                    ...s,
                    reviews: updatedReviews,
                    rating: parseFloat(averageRating.toFixed(1)),
                    updatedAt: new Date().toISOString()
                };
            }
            return s;
        }));
        showToast('تم حذف التقييم بنجاح');
    }, [showToast]);

    const handleReplyToReview = useCallback((serviceId: string, reviewId: string, reply: string) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId
                ? {
                    ...s,
                    reviews: s.reviews.map((r: Review) =>
                        r.id === reviewId
                            ? { ...r, adminReply: reply, updatedAt: new Date().toISOString() }
                            : r
                    ),
                    updatedAt: new Date().toISOString()
                }
                : s
        ));
        showToast('تم إضافة الرد بنجاح');
    }, [showToast]);

    // --- ENHANCED PROPERTIES HANDLERS ---
    const handleSaveProperty = useCallback((propertyData: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: string }) => {
        const defaults: Partial<Property> = {
            views: 0,
            creationDate: new Date().toISOString(),
        };

        genericSave<Property>(
            setProperties,
            propertyData,
            defaults,
            'العقار',
            propertyData.id ? 'تم تحديث العقار بنجاح!' : 'تمت إضافة العقار بنجاح!'
        );
    }, [genericSave]);

    const handleDeleteProperty = useCallback((propertyId: string) => {
        genericDelete(setProperties, propertyId, 'العقار');
    }, [genericDelete]);

    // --- USER & ADMIN HANDLERS ---
    const requestAccountDeletion = useCallback((userId: string) => {
        setUsers(prev => prev.map(u =>
            u.id === userId
                ? { ...u, status: 'deletion_requested', updatedAt: new Date().toISOString() }
                : u
        ));
        showToast('تم استلام طلب حذف حسابك بنجاح.');
    }, [showToast]);

    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: string }) => {
        const defaults: Partial<AppUser> = {
            joinDate: new Date().toISOString(),
        };

        genericSave<AppUser>(
            setUsers,
            userData,
            defaults,
            'المستخدم'
        );
    }, [genericSave]);

    const handleDeleteUser = useCallback((userId: string) => {
        genericDelete(setUsers, userId, 'المستخدم');
    }, [genericDelete]);

    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: string }) => {
        genericSave<AdminUser>(
            setAdmins,
            adminData,
            {},
            'المدير'
        );
    }, [genericSave]);

    const handleDeleteAdmin = useCallback((adminId: string) => {
        genericDelete(setAdmins, adminId, 'المدير');
    }, [genericDelete]);

    // --- OTHER DATA HANDLERS ---
    const handleSaveNews = useCallback((newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: string }) => {
        const defaults: Partial<News> = {
            author: 'Admin',
            date: new Date().toISOString(),
            views: 0,
        };

        genericSave<News>(setNews, newsItem, defaults, 'الخبر');
    }, [genericSave]);

    const handleDeleteNews = useCallback((newsId: string) => {
        genericDelete(setNews, newsId, 'الخبر');
    }, [genericDelete]);

    const handleSaveNotification = useCallback((notification: Omit<Notification, 'id'> & { id?: string }) => {
        genericSave<Notification>(setNotifications, notification, {}, 'الإشعار');
    }, [genericSave]);

    const handleDeleteNotification = useCallback((notificationId: string) => {
        genericDelete(setNotifications, notificationId, 'الإشعار');
    }, [genericDelete]);

    const handleSaveAdvertisement = useCallback((ad: Omit<Advertisement, 'id'> & { id?: string }) => {
        genericSave<Advertisement>(setAdvertisements, ad, {}, 'الإعلان');
    }, [genericSave]);

    const handleDeleteAdvertisement = useCallback((adId: string) => {
        genericDelete(setAdvertisements, adId, 'الإعلان');
    }, [genericDelete]);

    const handleSaveEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'> & { id?: string }) => {
        genericSave<EmergencyContact>(setEmergencyContacts, contact, {}, 'رقم الطوارئ');
    }, [genericSave]);

    const handleDeleteEmergencyContact = useCallback((contactId: string) => {
        genericDelete(setEmergencyContacts, contactId, 'رقم الطوارئ');
    }, [genericDelete]);

    const handleSaveServiceGuide = useCallback((guide: Omit<ServiceGuide, 'id'> & { id?: string }) => {
        genericSave<ServiceGuide>(setServiceGuides, guide, {}, 'دليل الخدمة');
    }, [genericSave]);

    const handleDeleteServiceGuide = useCallback((guideId: string) => {
        genericDelete(setServiceGuides, guideId, 'دليل الخدمة');
    }, [genericDelete]);

    const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
        showToast('تم حفظ بيانات المشرف بنجاح');
    }, [showToast]);

    const handleSaveDriver = useCallback((driver: Omit<Driver, 'id'> & { id?: string }) => {
        genericSave<Driver>(setInternalDrivers, driver, {}, 'السائق');
    }, [genericSave]);

    const handleDeleteDriver = useCallback((driverId: string) => {
        genericDelete(setInternalDrivers, driverId, 'السائق');
    }, [genericDelete]);

    const handleSaveRoute = useCallback((route: Omit<ExternalRoute, 'id'> & { id?: string }) => {
        genericSave<ExternalRoute>(setExternalRoutes, route, {}, 'المسار');
    }, [genericSave]);

    const handleDeleteRoute = useCallback((routeId: string) => {
        genericDelete(setExternalRoutes, routeId, 'المسار');
    }, [genericDelete]);

    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        showToast('تم حفظ الجدول الأسبوعي بنجاح');
    }, [showToast]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, content: PublicPagesContent[K]) => {
        setPublicPagesContent((prev) => ({
            ...prev,
            [page]: {
                ...content,
                updatedAt: new Date().toISOString()
            }
        }));
        showToast('تم تحديث محتوى الصفحة بنجاح');
    }, [showToast]);

    // Marketplace Handlers
    const handleSaveMarketplaceItem = useCallback((item: Omit<MarketplaceItem, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: string, duration: number }) => {
        if (!user) {
            showToast('يجب تسجيل الدخول لإضافة إعلان.', 'error');
            return;
        }

        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + item.duration);

        const newItemData: Partial<MarketplaceItem> & { id?: string } = {
            ...item,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString(),
            expirationDate: expirationDate.toISOString(),
            userId: user.uid,
            username: user.username || 'مستخدم',
            avatar: user.imageUrl || '',
        };

        genericSave<MarketplaceItem>(
            setMarketplaceItems,
            newItemData,
            {},
            'إعلان البيع',
            'تم إرسال إعلانك للمراجعة بنجاح'
        );
    }, [user, genericSave, showToast]);

    const handleDeleteMarketplaceItem = useCallback((itemId: string) => {
        genericDelete(setMarketplaceItems, itemId, 'إعلان البيع');
    }, [genericDelete]);

    const handleUpdateMarketplaceItemStatus = useCallback((itemId: string, status: ListingStatus, rejectionReason?: string) => {
        setMarketplaceItems(prev => prev.map(item =>
            item.id === itemId
                ? {
                    ...item,
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : undefined,
                    updatedAt: new Date().toISOString()
                }
                : item
        ));
        showToast(`تم تحديث حالة الإعلان إلى "${status}" بنجاح`);
    }, [showToast]);

    // Job Handlers
    const handleSaveJobPosting = useCallback((job: Omit<JobPosting, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: string, duration: number }) => {
        if (!user) {
            showToast('يجب تسجيل الدخول لإضافة وظيفة.', 'error');
            return;
        }

        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + job.duration);

        const newJobData: Partial<JobPosting> & { id?: string } = {
            ...job,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString(),
            expirationDate: expirationDate.toISOString(),
            userId: user.uid,
            username: user.username || 'مستخدم',
            avatar: user.imageUrl || '',
        };

        genericSave<JobPosting>(
            setJobPostings,
            newJobData,
            {},
            'إعلان الوظيفة',
            'تم إرسال إعلان الوظيفة للمراجعة بنجاح'
        );
    }, [user, genericSave, showToast]);

    const handleDeleteJobPosting = useCallback((jobId: string) => {
        genericDelete(setJobPostings, jobId, 'إعلان الوظيفة');
    }, [genericDelete]);

    const handleUpdateJobPostingStatus = useCallback((jobId: string, status: ListingStatus, rejectionReason?: string) => {
        setJobPostings(prev => prev.map(job =>
            job.id === jobId
                ? {
                    ...job,
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : undefined,
                    updatedAt: new Date().toISOString()
                }
                : job
        ));
        showToast(`تم تحديث حالة الوظيفة إلى "${status}" بنجاح`);
    }, [showToast]);

    const value: DataContextType = {
        // State
        categories,
        services,
        properties,
        news,
        notifications,
        advertisements,
        emergencyContacts,
        serviceGuides,
        users,
        admins,
        auditLogs,
        transportation: {
            internalSupervisor,
            externalSupervisor,
            internalDrivers,
            weeklySchedule,
            externalRoutes,
        },
        publicPagesContent,
        marketplaceItems,
        jobPostings,

        // Service Handlers
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
        handleToggleHelpfulReview,
        addReview,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,

        // Property Handlers
        handleSaveProperty,
        handleDeleteProperty,

        // User & Admin Handlers
        requestAccountDeletion,
        handleSaveUser,
        handleDeleteUser,
        handleSaveAdmin,
        handleDeleteAdmin,

        // Other Data Handlers
        handleSaveNews,
        handleDeleteNews,
        handleSaveNotification,
        handleDeleteNotification,
        handleSaveAdvertisement,
        handleDeleteAdvertisement,
        handleSaveEmergencyContact,
        handleDeleteEmergencyContact,
        handleSaveServiceGuide,
        handleDeleteServiceGuide,
        handleSaveSupervisor,
        handleSaveDriver,
        handleDeleteDriver,
        handleSaveRoute,
        handleDeleteRoute,
        handleSaveSchedule,
        handleUpdatePublicPageContent,

        // Marketplace & Job Handlers
        handleSaveMarketplaceItem,
        handleDeleteMarketplaceItem,
        handleUpdateMarketplaceItemStatus,
        handleSaveJobPosting,
        handleDeleteJobPosting,
        handleUpdateJobPostingStatus
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};