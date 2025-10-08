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
    imageUrl: string;
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
    id: string;
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