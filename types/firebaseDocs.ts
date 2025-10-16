export interface NewsDocData {
    id: string;
    title: string;
    content: string;
    link: string;
    imageUrl: string;
    createdAt: Date;
}

export interface NotificatioDocData {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
    read?: boolean;
    createdAt: Date;
}

export interface ServiceDocData {
    id: string;
    address: string;
    category: string;
    createdAt: Date;
    description: string;
    facebookLink?: string;
    integramLink?: string;
    imageUrl: string[];
    name: string;
    phone: string;
    secondPhone?: string
    subCategory: string;
    whatsapp: string;
    workTime?: string

    avgRating?: number;
    ratingCount?: number;
}

export interface AdvertisementsDocData {
    id: string;
    imageUrl: string;
    title?: string;
    createdAt: Date;
}


export interface RatingDocData {
    id?: string;
    userId: string;       // ID of the user who rated
    userName: string;     // display name (optional)
    rating: number;       // e.g. 4.5
    avatar?: string;
    comment?: string;     // user's comment (optional)
    createdAt: Date;      // timestamp
}

export type emerencyType = "city" | "national"

export interface EmerengyDocData {
    id: string;
    name: string;
    phone: string;
    type: emerencyType
}

export type propertyType = "rent" | "sale"

export interface PropertyDocData {
    id?: string;
    title: string;
    createdAt: Date;
    images: string[];
    description: string;
    phone: string;
    type: propertyType
    address: string;
    amenities: string[] //وسائل الراحة
    contactName: string;
    price: number
}

export type itemStatus = "approved" | "rejected" | "pending"

export interface Market {
    id?: string;
    userId: string;
    username: string;
    avatar: string;
    title: string;
    description: string;
    images: string[];
    category: string;
    price: number;
    phone: string;
    creationDate: Date
    expirationDate: Date
    status: itemStatus;
    rejectionReason?: string
}

export type jobType = 'دوام جزئي' | 'دوام كامل' | "عقد" | "تدريب"

export interface JobDocData {
    id?: string
    userId: string
    username: string
    avatar: string
    title: string
    companyName: string
    description: string
    location: string
    type: jobType
    contactInfo: string
    status: itemStatus
    rejectionReason?: string;
    creationDate: Date
    expirationDate: Date
}


export interface CityAgencyDoc {
    id: string;
    title: string;
    stepsToApply: string[];
    requiredDocs: string[];
}

export interface BusesExternalDocData {
    id: string;
    routeName: string;
    supervisorName: string;
    supervisorPhone: string;
    times: string[];
    waitingLocation?: string;
}

interface Drvier {
    phone: string;
    name: string;
}

interface Days {
    date: string
    day: string
    drivers: Drvier[]
    driversCount: number
}

export interface BusesInternalDoc {
    id: string;
    supervisorName: string;
    supervisorPhone: string;
    days: Days[];
    createdAt: Date;
}

export type Category = 'نقاش عام' | 'نقاش خاص' | 'سؤال' | 'استطلاع رأي' | 'حدث'

interface Comments {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    createdAt: Date;
}

export interface Poll {
    option: string;
    vote: string[]
}

export interface PostDocData {
    id?: string;
    userId: string;
    username: string;
    avatar: string;
    title: string;
    content: string;
    category: Category;
    likes: string[]
    comments: Comments[];
    isPinned: boolean;
    pollOptions: Poll[];
    targetAudience?: string; // For 'نقاش خاص'
    createdAt: Date;
}

export type MissingItemStatus = "وجد" | "مفقود"

export interface MissingItemDoc {
    id?: string;
    title: string;
    description: string
    categoty: string;
    status: MissingItemStatus;
    location?: string;
    dateReported: Date;
    dateFound?: Date;
    images: string[];
    reportedBy: string;
    repoterName: string;
    reporterAvatar: string;
}

export interface UsersDoc {
    id: string;
    username: string;
    email: string;
    imageUrl: string;
    createdAt: Date
}