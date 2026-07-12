export type OfferCategory = 'Gift Card' | 'Email Submit' | 'Pin Submit' | 'App Install';

export interface Offer {
  id: string;
  title: string;
  category: OfferCategory;
  description: string;
  requirement: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  estTime: string;
  rating: number;
  featured?: boolean;
  rewardValue?: string;
  payoutPoints?: number;
}

export interface LiveClaim {
  id: string;
  name: string;
  location: string;
  offerTitle: string;
  timeAgo: string;
  avatarSeed: string;
}

export interface UserReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatarSeed: string;
  verified: boolean;
}
