import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provision } from './provision.model';

@Injectable({
  providedIn: 'root'
})
export class ProvisionService {
  private apiUrl = 'http://localhost:8080/api/provisions';

  constructor(private http: HttpClient) {}

  getAllProvisions(): Observable<Provision[]> {
    return this.http.get<Provision[]>(this.apiUrl);
  }

  createProvision(formData: FormData): Observable<Provision> {
    return this.http.post<Provision>(`${this.apiUrl}`, formData);
  }

  getProvisionById(provisionId: number): Observable<Provision> {
    return this.http.get<Provision>(`${this.apiUrl}/${provisionId}`);
  }
 
    deleteProvision(provisionId: number): Observable<void> {
      const url = `${this.apiUrl}/${provisionId}`;
      return this.http.delete<void>(url);
    }
    getUserProvisions(userId: number): Observable<Provision[]> {
      return this.http.get<Provision[]>(`${this.apiUrl}/my-provisions?userId=${userId}`);
    }
    
    updateProvision(id: number, provision: Provision): Observable<Provision> {
      const url = `http://localhost:8080/api/provisions/${id}`; 
      return this.http.put<Provision>(url, provision);
    }
    
    
}
