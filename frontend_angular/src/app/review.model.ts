export interface Review {
    id: number;
    userId: number;
    provisionId: number;
    rating: number;
    comment: string;
    userName?: string;
  }
  