import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    getCountFromServer,
    collectionGroup
} from "firebase/firestore";
import {
    ServiceDocData,
    PropertyDocData,
    NewsDocData,
    NotificatioDocData,
    EmerengyDocData,
    BusesInternalDoc,
    UsersDoc
} from "@/types/firebaseDocs";

export interface DashboardStats {
    totalServices: number;
    totalProperties: number;
    totalUsers: number;
    totalNewsAndNotifications: number;
    recentServicesCount: number;
    recentPropertiesCount: number;
    recentUsersCount: number;
    recentNewsAndNotificationsCount: number;
    emergencyReportsCount: number;
    busTripsCount: number;
}

export interface DashboardData {
    services: ServiceDocData[];
    properties: PropertyDocData[];
    news: NewsDocData[];
    notifications: NotificatioDocData[];
    emergencies: EmerengyDocData[];
    busSchedules: BusesInternalDoc[];
    stats: DashboardStats;
}

export async function fetchDashboardData(): Promise<DashboardData> {
    try {
        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);


        const [
            servicesSnapshot,
            propertiesSnapshot,
            newsSnapshot,
            notificationsSnapshot,
            emergenciesSnapshot,
            busSchedulesSnapshot,
            usersSnapshot,
            totalServicesSnapshot,      // <-- this will be collectionGroup
            totalPropertiesSnapshot,
            totalUsersSnapshot,
            totalNewsSnapshot,
            totalNotificationsSnapshot
        ] = await Promise.all([
            getDocs(collection(db, FIREBASE_DOCS.SERVICES)),       // categories
            getDocs(collection(db, FIREBASE_DOCS.PROPERTIES)),
            getDocs(collection(db, FIREBASE_DOCS.NEWS)),
            getDocs(collection(db, FIREBASE_DOCS.NOTIFICATIONS)),
            getDocs(collection(db, FIREBASE_DOCS.EMERGENCIES)),
            getDocs(collection(db, FIREBASE_DOCS.BUSES_INTERNAL)),
            getDocs(collection(db, FIREBASE_DOCS.USERS)),
            // count all service docs inside any subcollection named "services"
            getCountFromServer(collectionGroup(db, "items")),
            getCountFromServer(collection(db, FIREBASE_DOCS.PROPERTIES)),
            getCountFromServer(collection(db, FIREBASE_DOCS.USERS)),
            getCountFromServer(collection(db, FIREBASE_DOCS.NEWS)),
            getCountFromServer(collection(db, FIREBASE_DOCS.NOTIFICATIONS))
        ]);

        // get numeric count
        const totalServicesCount = totalServicesSnapshot.data().count;


        // Helper function to safely convert Firestore timestamp
        const safeConvertDate = (timestamp: any): Date | null => {
            if (!timestamp) return null;

            // If it's a Firestore timestamp
            if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }

            // If it's already a Date object
            if (timestamp instanceof Date) {
                return timestamp;
            }

            // If it's a string that can be parsed
            if (typeof timestamp === 'string') {
                const parsed = new Date(timestamp);
                return isNaN(parsed.getTime()) ? null : parsed;
            }

            // If it's a number (timestamp)
            if (typeof timestamp === 'number') {
                return new Date(timestamp);
            }

            return null;
        };

        // Convert snapshots to data arrays
        const services: ServiceDocData[] = servicesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: safeConvertDate(data.createdAt) || new Date()
            } as ServiceDocData;
        });

        const properties: PropertyDocData[] = propertiesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: safeConvertDate(data.createdAt) || new Date()
            } as PropertyDocData;
        });

        const news: NewsDocData[] = newsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: safeConvertDate(data.createdAt) || new Date()
            } as NewsDocData;
        });

        const notifications: NotificatioDocData[] = notificationsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: safeConvertDate(data.createdAt) || new Date()
            } as NotificatioDocData;
        });

        const emergencies: EmerengyDocData[] = emergenciesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as EmerengyDocData[];

        const busSchedules: BusesInternalDoc[] = busSchedulesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: safeConvertDate(data.createdAt) || new Date()
            } as BusesInternalDoc;
        });

        const users: UsersDoc[] = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            username: doc.data().username || doc.data().name || doc.data().displayName || "",
            ...doc.data(),
            createdAt: safeConvertDate(doc.data().createdAt) || new Date()
        })) as UsersDoc[]

        // Calculate recent counts (last 30 days)
        const recentServicesCount = services.filter(s => s.createdAt >= thirtyDaysAgo).length;
        const recentPropertiesCount = properties.filter(p => p.createdAt >= thirtyDaysAgo).length;

        const recentUsersCount = users.filter(user => user.createdAt >= thirtyDaysAgo).length;

        const recentNewsCount = news.filter(n => n.createdAt >= thirtyDaysAgo).length;
        const recentNotificationsCount = notifications.filter(n => n.createdAt >= thirtyDaysAgo).length;

        // Calculate bus trips (mock calculation based on schedules)
        const totalBusTrips = busSchedules.reduce((total, schedule) => {
            return total + schedule.days.reduce((dayTotal, day) => dayTotal + day.driversCount, 0);
        }, 0);

        const stats: DashboardStats = {
            totalServices: totalServicesCount,
            totalProperties: totalPropertiesSnapshot.data().count,
            totalUsers: totalUsersSnapshot.data().count,
            totalNewsAndNotifications: totalNewsSnapshot.data().count + totalNotificationsSnapshot.data().count,
            recentServicesCount,
            recentPropertiesCount,
            recentUsersCount,
            recentNewsAndNotificationsCount: recentNewsCount + recentNotificationsCount,
            emergencyReportsCount: emergencies.length,
            busTripsCount: totalBusTrips * 7 // Assuming daily trips for a week
        };

        return {
            services,
            properties,
            news,
            notifications,
            emergencies,
            busSchedules,
            stats
        };

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to fetch dashboard data');
    }
}

export interface RecentActivity {
    id: string;
    type: 'NEW_SERVICE' | 'NEW_PROPERTY' | 'NEWS_PUBLISHED' | 'EMERGENCY_REPORT';
    description: string;
    time: Date;
    user?: {
        name: string;
        avatarUrl: string;
    };
}

export async function fetchRecentActivity(): Promise<RecentActivity[]> {
    try {
        // Calculate date 7 days ago for recent activities
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch recent data from all collections in parallel
        const [
            recentServicesSnapshot,
            recentPropertiesSnapshot,
            recentNewsSnapshot,
            recentEmergenciesSnapshot
        ] = await Promise.all([
            // Get recent services
            getDocs(query(
                collection(db, FIREBASE_DOCS.SERVICES),
                orderBy('createdAt', 'desc'),
                limit(10)
            )),
            // Get recent properties
            getDocs(query(
                collection(db, FIREBASE_DOCS.PROPERTIES),
                orderBy('createdAt', 'desc'),
                limit(10)
            )),
            // Get recent news
            getDocs(query(
                collection(db, FIREBASE_DOCS.NEWS),
                orderBy('createdAt', 'desc'),
                limit(10)
            )),
            // Get recent emergencies
            getDocs(query(
                collection(db, FIREBASE_DOCS.EMERGENCIES),
                orderBy('createdAt', 'desc'),
                limit(5)
            ))
        ]);

        // Convert to activities
        const activities: RecentActivity[] = [];

        // Helper function to safely convert Firestore timestamp
        const safeConvertDate = (timestamp: any): Date | null => {
            if (!timestamp) return null;

            // If it's a Firestore timestamp
            if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }

            // If it's already a Date object
            if (timestamp instanceof Date) {
                return timestamp;
            }

            // If it's a string that can be parsed
            if (typeof timestamp === 'string') {
                const parsed = new Date(timestamp);
                return isNaN(parsed.getTime()) ? null : parsed;
            }

            // If it's a number (timestamp)
            if (typeof timestamp === 'number') {
                return new Date(timestamp);
            }

            return null;
        };

        // Add service activities
        recentServicesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const createdAt = safeConvertDate(data.createdAt);

            if (createdAt && createdAt >= sevenDaysAgo) {
                activities.push({
                    id: `service-${doc.id}`,
                    type: 'NEW_SERVICE',
                    description: `تمت إضافة خدمة جديدة: ${data.name}`,
                    time: createdAt
                });
            }
        });

        // Add property activities
        recentPropertiesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const createdAt = safeConvertDate(data.createdAt);

            if (createdAt && createdAt >= sevenDaysAgo) {
                activities.push({
                    id: `property-${doc.id}`,
                    type: 'NEW_PROPERTY',
                    description: `تمت إضافة عقار جديد: ${data.title}`,
                    time: createdAt
                });
            }
        });

        // Add news activities
        recentNewsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const createdAt = safeConvertDate(data.createdAt);

            if (createdAt && createdAt >= sevenDaysAgo) {
                activities.push({
                    id: `news-${doc.id}`,
                    type: 'NEWS_PUBLISHED',
                    description: `تم نشر خبر جديد: ${data.title}`,
                    time: createdAt
                });
            }
        });

        // Add emergency activities
        recentEmergenciesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const createdAt = safeConvertDate(data.createdAt);

            if (createdAt && createdAt >= sevenDaysAgo) {
                activities.push({
                    id: `emergency-${doc.id}`,
                    type: 'EMERGENCY_REPORT',
                    description: `تم إبلاغ عن طوارئ: ${data.name}`,
                    time: createdAt
                });
            }
        });

        // Sort by time (most recent first) and limit to 5
        return activities
            .sort((a, b) => b.time.getTime() - a.time.getTime())
            .slice(0, 5);

    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw new Error('Failed to fetch recent activity');
    }
}

export interface UserActivityData {
    name: string;
    "مستخدمين جدد": number;
    "إجمالي المستخدمين": number;
}

export async function fetchUserActivityData(): Promise<UserActivityData[]> {
    try {
        // Calculate date 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Start of month

        // Get all users
        const usersSnapshot = await getDocs(collection(db, FIREBASE_DOCS.USERS));

        // Convert to array with proper date handling
        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();

            // Helper function to safely convert Firestore timestamp
            const safeConvertDate = (timestamp: any): Date | null => {
                if (!timestamp) return null;

                // If it's a Firestore timestamp
                if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                    return timestamp.toDate();
                }

                // If it's already a Date object
                if (timestamp instanceof Date) {
                    return timestamp;
                }

                // If it's a string that can be parsed
                if (typeof timestamp === 'string') {
                    const parsed = new Date(timestamp);
                    return isNaN(parsed.getTime()) ? null : parsed;
                }

                // If it's a number (timestamp)
                if (typeof timestamp === 'number') {
                    return new Date(timestamp);
                }

                return null;
            };

            const createdAt = safeConvertDate(data.createdAt);
            const joinDate = safeConvertDate(data.joinDate);

            return {
                id: doc.id,
                createdAt,
                joinDate
            };
        }).filter(user => {
            // Only include users that have valid dates
            return user.createdAt !== null || user.joinDate !== null;
        });

        // Arabic month names
        const monthNames = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        // Generate data for last 6 months
        const monthlyData: UserActivityData[] = [];

        // First, calculate new users for each month
        const monthlyNewUsers: { month: number, year: number, count: number }[] = [];

        for (let i = 0; i < 6; i++) {
            const targetDate = new Date();
            targetDate.setMonth(targetDate.getMonth() - i);
            targetDate.setDate(1); // Start of month

            const nextMonth = new Date(targetDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            // Count new users in this month
            const newUsersThisMonth = users.filter(user => {
                const userDate = user.joinDate || user.createdAt;
                // Only count users with valid dates
                return userDate && userDate >= targetDate && userDate < nextMonth;
            }).length;

            monthlyNewUsers.unshift({
                month: targetDate.getMonth(),
                year: targetDate.getFullYear(),
                count: newUsersThisMonth
            });
        }

        // Calculate cumulative users (going forward in time)
        let cumulativeUsers = 0;
        for (const monthData of monthlyNewUsers) {
            cumulativeUsers += monthData.count;

            monthlyData.push({
                name: monthNames[monthData.month],
                "مستخدمين جدد": monthData.count,
                "إجمالي المستخدمين": cumulativeUsers
            });
        }

        return monthlyData;

    } catch (error) {
        console.error('Error fetching user activity data:', error);
        throw new Error('Failed to fetch user activity data');
    }
}

export async function fetchUsersToVerify(): Promise<any[]> {
    try {
        // This would fetch users with pending status
        // For now, return empty array - can be implemented later
        return [];
    } catch (error) {
        console.error('Error fetching users to verify:', error);
        throw new Error('Failed to fetch users to verify');
    }
}
