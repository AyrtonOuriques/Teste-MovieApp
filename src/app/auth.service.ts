import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';

export interface JwtResponse {
  access: string;
  refresh: string;  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://emerging-dynamic-opossum.ngrok-free.app';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUser: string = '';


  constructor(private http: HttpClient , private router: Router) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': '111'
      })
    };
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token'); 
    return this.http.post<JwtResponse>(`${this.apiUrl}/api/token/refresh/`, { refresh: refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);  
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
        localStorage.setItem('token', response.access); 
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem(this.currentUser, username);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate([returnUrl]); 
      })
    );
  }

  getCurrentUserName(): string | null{
    return localStorage.getItem(this.currentUser);
  }

  getPublicFavoriteMovies(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public-favorite-movies/${username}/` , {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': '111'
      })
    });
  }

  getFavoriteMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorite-movies/`, this.getAuthHeaders()).pipe(
      catchError(error => {
        if (error.status === 401) { 
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
        if (error.status === 401) {  
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
        if (error.status === 401) {  
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
    localStorage.removeItem(this.currentUser);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['']); 
  }
}
