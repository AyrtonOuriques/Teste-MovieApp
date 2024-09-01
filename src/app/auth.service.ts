import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';

export interface JwtResponse {
  access: string;
  refresh: string;  // if you're also using the refresh token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://2fea-2804-1b1-220c-5a64-90f7-96b5-4fb8-8da.ngrok-free.app';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  constructor(private http: HttpClient , private router: Router) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token'); // Assuming you store the refresh token
    return this.http.post<JwtResponse>(`${this.apiUrl}/api/token/refresh/`, { refresh: refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);  // Save new access token
      }),
      catchError(error => {
        console.error('Token refresh failed', error);
        return throwError(error);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, password });
  }

  login(username: string, password: string, returnUrl: string = ''): Observable<any> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/api/token/`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);  // Save JWT token
        localStorage.setItem('refresh_token', response.refresh);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate([returnUrl]);  // Update authentication status
      })
    );
  }

  getFavoriteMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorite-movies/`, this.getAuthHeaders()).pipe(
      catchError(error => {
        if (error.status === 401) {  // Unauthorized error
          return this.refreshToken().pipe(
            switchMap(() => this.http.get(`${this.apiUrl}/favorite-movies/`, this.getAuthHeaders()))
          );
        } else {
          return throwError(error);
        }
      }));;
  }

  addFavoriteMovie(movie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorite-movies/`, movie, this.getAuthHeaders()).pipe(
      catchError(error => {
        if (error.status === 401) {  // Unauthorized error
          return this.refreshToken().pipe(
            switchMap(() => this.http.post(`${this.apiUrl}/favorite-movies/`, movie, this.getAuthHeaders()))
          );
        } else {
          return throwError(error);
        }
      }));
  }

  removeFavoriteMovie(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorite-movies/${movieId}/`, this.getAuthHeaders()).pipe(
      catchError(error => {
        if (error.status === 401) {  // Unauthorized error
          return this.refreshToken().pipe(
            switchMap(() => this.http.delete(`${this.apiUrl}/favorite-movies/${movieId}/`, this.getAuthHeaders()))
          );
        } else {
          return throwError(error);
        }
      }));;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  checkAuth(url: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
      return false;
    } else {
      return true;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['']); 
  }
}
