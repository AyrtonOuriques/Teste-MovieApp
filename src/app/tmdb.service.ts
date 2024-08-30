import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = 'a6fc99befd421d9088a9c55fb3e1151f';
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  searchMovies(query: string, currentPage: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${currentPage}`);
  }

  getMovieDetails(id: string): Observable<any> {
    const movieDetails = this.http.get(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
    const movieCredits = this.http.get(`${this.apiUrl}/movie/${id}/credits?api_key=${this.apiKey}`);
    return forkJoin([movieDetails, movieCredits]);
  }
}