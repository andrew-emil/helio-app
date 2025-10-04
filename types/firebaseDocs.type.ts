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
    externalLink?: string;
    imageUrl: string;
    name: string;
    phone: string;
    secondPhone?: string
    subCategory: string;
    whatsapp: string;
    workTime?: string
}

export interface AdvertisementsDocData {
    id: string;
    createdAt: Date;
    imageUrl: string;
    title?: string;
}

export interface PropertyDocData {
    id: string;
    createdAt: Date;
    images: string[];
    description: string;
    phone: string;
    type: 'sale' | "rent"
}