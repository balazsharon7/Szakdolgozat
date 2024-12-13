import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from './review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(userId: number, provisionId: number, rating: number, comment: string): Observable<Review> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('provisionId', provisionId.toString())
      .set('rating', rating.toString())
      .set('comment', comment);
    return this.http.post<Review>(this.baseUrl, null, { params });
  }

  getReviewsByProvisionId(provisionId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/provision/${provisionId}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
