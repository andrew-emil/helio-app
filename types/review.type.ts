export interface Review {
    serviceName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface UserReviewsProps {
    userReviews: Review[];
}