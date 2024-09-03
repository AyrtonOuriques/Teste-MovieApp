import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, JwtResponse } from './auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };
  
  const apiUrl = 'https://emerging-dynamic-opossum.ngrok-free.app';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const username = 'testuser';
    const password = 'password';
    const dummyResponse = { success: true };

    service.register(username, password).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/register/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should log in a user and store tokens', () => {
    const username = 'testuser';
    const password = 'password';
    const returnUrl = '/';
    const dummyResponse: JwtResponse = { access: 'access-token', refresh: 'refresh-token' };

    service.login(username, password, returnUrl).subscribe(() => {
      expect(localStorage.getItem('token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
      expect(localStorage.getItem('')).toBe(username);
      expect(service.isAuthenticated$).toBeTruthy();
      expect(routerSpy.navigate).toHaveBeenCalledWith([returnUrl]);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/token/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should refresh the token when it expires', () => {
    const refreshToken = 'refresh-token';
    localStorage.setItem('refresh_token', refreshToken);

    const dummyResponse: JwtResponse = { access: 'new-access-token', refresh: 'new-refresh-token' };

    service.refreshToken().subscribe(response => {
      expect(localStorage.getItem('token')).toBe('new-access-token');
    });

    const req = httpMock.expectOne(`${apiUrl}/api/token/refresh/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should add a movie to favorites with valid token', () => {
    const movie = { movieid: 1, title: 'test'};
    const dummyResponse = { success: true };
    localStorage.setItem('token', 'access-token');
  
    service.addFavoriteMovie(movie).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });
  
    const req = httpMock.expectOne(`${apiUrl}/favorite-movies/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });


  it('should get the favorite movies with valid token', () => {
    localStorage.setItem('token', 'access-token');

    service.getFavoriteMovies().subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/favorite-movies/`);
    expect(req.request.method).toBe('GET');
  });

  it('should retrieve public favorite movies for a given username', () => {
    const username = 'testuser';
    const dummyMovies = [
      { id: 1, title: 'test', movieId: 1 }
    ];

    service.getPublicFavoriteMovies(username).subscribe(movies => {
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne(`${apiUrl}/public-favorite-movies/${username}/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('ngrok-skip-browser-warning')).toBe('111');

    req.flush(dummyMovies); // Provide the mock data to return in the response
  });

  it('should remove a movie from favorites with valid token', () => {
    const movieId = 1;
    const dummyResponse = { success: true };
    localStorage.setItem('token', 'access-token');
  
    service.removeFavoriteMovie(movieId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });
  
    const req = httpMock.expectOne(`${apiUrl}/favorite-movies/${movieId}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

});