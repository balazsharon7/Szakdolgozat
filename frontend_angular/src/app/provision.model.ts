export interface Provision {
    provisionId?: number; 
    name: string;
    description: string;
    price: number;
    duration: number;
    provider: string;
    userId: number; 
    imageUrl?: string; 
}
