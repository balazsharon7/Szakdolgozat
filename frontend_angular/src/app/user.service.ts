import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://localhost:8080/api';
  public loggedInUser: { uname: string; role: string; userId: number } | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
    }
  }
  

  async registerUser(email: string, username: string, password: string, role: string) {
    console.log('registerUser');
    const data = {
      email,
      uname: username,
      pwd: password,
      role,  
    };
    try {
      const response: any = await firstValueFrom(
        this.http.post(this.apiURL + '/user/new', data)
      );

      if (response.message === 'Registration was successful') {
        return true;
      } else if (response.message === 'User already exists') {
        return false;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(username: string, password: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.post(this.apiURL + '/user/authenticate', {
          username,
          password,
        })
      );
  
      if (response.token) {
        this.loggedInUser = {
          uname: response.username,
          role: response.role,
          userId: Number(response.userId),
        };
        localStorage.setItem('token', response.token); 
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser)); 
        return response;
      } else {
        return { error: 'Login failed: no token returned' };
      }
    } catch (error: any) {
      if (error.status === 401) {
        return { error: 'Hibás felhasználónév vagy jelszó', status: 401 };
      } else {
        return { error: 'Valami hiba történt', status: error.status };
      }
    }
  }
  
  
  getUserBookingCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiURL}provisions/count/${userId}`);
  }
  


  getCurrentUser() {
    return this.loggedInUser;
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  isBusiness(): string {
    
    return 'BUSINESS';
  }
  
  getUsernameById(userId: number): Observable<string> {
    return this.http.get<any>(`${this.apiURL}/user/${userId}`).pipe(
      map((user) => user.uname), 
      catchError((error) => {
        console.error(`Hiba történt a felhasználónév lekérésekor (ID: ${userId}):`, error);
        return of(`Ismeretlen felhasználó`); 
      })
    );
  }
  
  updateProfile(profile: { id: number; email: string; password: string; uname: string }): Observable<any> {
    const url = `http://localhost:8080/api/user/${profile.id}`;
    return this.http.put(url, {
      email: profile.email,
      password: profile.password,
      uname: profile.uname,
    });
  }
  
  
  
  
  
  
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser'); 
    this.loggedInUser = null;
  }
  

}
