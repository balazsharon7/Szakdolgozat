import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError} from 'rxjs';
import { Message } from './messages.model';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private apiURL = 'http://localhost:8080/api/messages';
  constructor(private http: HttpClient) {}

  // Üzenet küldése
  sendMessage(senderId: number, receiverId: number, content: string): Observable<any> {
    const params = new HttpParams()
      .set('senderId', senderId.toString())
      .set('receiverId', receiverId.toString())
      .set('content', content);

    return this.http.post(`${this.apiURL}/send`, params);
  }

    // Üzenetek lekérése feladónként
    getMessagesBySenderId(senderId: number): Observable<any> {
      return this.http.get<any>(`${this.apiURL}/sent?senderId=${senderId}`);
    }

    getMessagesByReceiverId(receiverId: number): Observable<Message[]> {
      return this.http.get<Message[]>(`${this.apiURL}/received?receiverId=${receiverId}`).pipe(
        tap((response) => console.log('API válasz:', response)),
        catchError((error) => {
          console.error('API hiba:', error);
          return throwError(() => error);
        })
      );
    }
    

    
}
