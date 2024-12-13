import { Provision } from './provision.model';

export interface Booking {
  id: number;
  userId: number;
  username?: string; // Felhasználónév opcionálisan
  bookingTime: Date;
  status: string;
  provisionId: number;
  provision?: Provision;
  creatorUserId?: number; // Most már opcionális
}
