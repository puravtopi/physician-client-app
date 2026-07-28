export interface Physician {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  distance: number;
  languages: string[];
  experience: number;
  verified: boolean;
  acceptsInsurance: boolean;
  availableSlots: number;
  phone?: string;
  email?: string;
  website?: string;
  hospital?: string;
}

export interface PhysicianFilter {
  specialty?: string;
  location?: string;
  minRating?: number;
  distance?: number;
  availableOnly?: boolean;
  verifiedOnly?: boolean;
  acceptsInsurance?: boolean;
  searchQuery?: string;
}

export interface PhysicianSort {
  by: 'rating' | 'distance' | 'experience' | 'reviews';
  order: 'asc' | 'desc';
}

export interface ReviewModal {
  id: number;
  placeId: number;
  author: string;
  text: string;
  rating: number;
  /** Represented as an ISO string (YYYY-MM-DD) */
  date: string; 
}
