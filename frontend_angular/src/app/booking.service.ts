import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Booking} from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';  

  private selectedBookingId: number; 
  constructor(private http: HttpClient) {
    this.selectedBookingId=0;
  }

  
  createBooking(userId: number, provisionId: number): Observable<Booking> {
    const url = `${this.apiUrl}/create?userId=${userId}&provisionId=${provisionId}`;
    return this.http.post<Booking>(url, {}).pipe(
      catchError((error) => {
        console.error('Hiba történt a foglalás létrehozása során:', error);
        return throwError(() => new Error('Foglalás sikertelen.'));
      })
    );
}


  
  getBookingsByUserId(userId: number): Observable<Booking[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<Booking[]>(url).pipe(
      catchError((error) => {
        console.error('Hiba történt a foglalások lekérése során:', error);
        return throwError(() => new Error('Nem sikerült lekérni a foglalásokat.'));
      })
    );
  }

  deleteBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`);
  }
  setSelectedBookingId(bookingId: number): void {
    this.selectedBookingId = bookingId;
  }

  getSelectedBookingId(): number {
    return this.selectedBookingId;
  }

  getBookingById(bookingId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  getBookingsByProvisionId(provisionId: number): Observable<Booking[]> {
    const url = `${this.apiUrl}/provision/${provisionId}`;
    return this.http.get<Booking[]>(url);
  }
  
  getBookingsByCreatorUserId(creatorUserId: number): Observable<Booking[]> {
    const url = `${this.apiUrl}/creator/${creatorUserId}`;
    return this.http.get<Booking[]>(url);
  }

  updateBookingDate(bookingId: number, newDate: Date,status:string): Observable<any> {
    const url = `${this.apiUrl}/update-date/${bookingId}`;
    return this.http.put(url, { newDate: newDate.toISOString() }).pipe(
      catchError((error) => {
        console.error('Hiba történt a foglalás időpontjának frissítésekor:', error);
        return throwError(() => new Error('Foglalás időpontjának frissítése sikertelen.'));
      })
    );
  }

  updateBooking(bookingId: number, newDate: string, status: string): Observable<Booking> {
    const url = `${this.apiUrl}/${bookingId}`;
    const params = new URLSearchParams({
      status,
      newDate
    }).toString();
    return this.http.put<Booking>(`${url}?${params}`, null).pipe(
      catchError((error) => {
        console.error('Hiba történt a foglalás frissítésekor:', error);
        return throwError(() => new Error('Foglalás frissítése sikertelen.'));
      })
    );
  }
  
  

    getAllBookings(): Observable<Booking[]> {
      return this.http.get<Booking[]>(this.apiUrl);
    }
  
  
  getBookingsByProvisionIdWithUsername(provisionId: number): Observable<any[]> {
    const url = `${this.apiUrl}/provision-with-username/${provisionId}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Hiba történt a foglalások lekérése során (username):', error);
        return throwError(() => new Error('Nem sikerült lekérni a foglalásokat.'));
      })
    );
  }
  
  getFinalizedBookingsByUserId(userId: number): Observable<Booking[]> {
    const url = `${this.apiUrl}/user/${userId}/finalized-bookings`;
    return this.http.get<Booking[]>(url).pipe(
      map((response) => response || []),
      catchError((error) => {
        if (error.status === 404) {
          console.error('Nincsenek véglegesített foglalások.');
        } else {
          console.error('Hiba történt a véglegesített foglalások lekérése során:', error);
        }
        return of([]); 
      })
    );
  }
  
  
  
  
  
  
}
