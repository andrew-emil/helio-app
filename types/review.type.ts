export interface Review {
    id: string;
    serviceName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface UserReviewsProps {
    userReviews: Review[];
}