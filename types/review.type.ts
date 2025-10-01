export interface Review {
    id: string;
    serviceName: string;
    rating: number;
    comment: string;
    date: string;
    adminReply?: string;
}

export interface UserReviewsProps {
    userReviews: Review[];
}