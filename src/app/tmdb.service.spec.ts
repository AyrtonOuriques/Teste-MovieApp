import { TestBed } from '@angular/core/testing';

import { TmdbService } from './tmdb.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;
  const apiKey = 'a6fc99befd421d9088a9c55fb3e1151f';
  const apiUrl = 'https://api.themoviedb.org/3';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmdbService]
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a search for movies', () => {
    const query = 'test';
    const currentPage = 1;
    const dummyResponse = { results: [] };

    service.searchMovies(query, currentPage).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should get movie details and credits', () => {
    const movieId = '123';
    const dummyDetailsResponse = { id: movieId, title: 'test' };
    const dummyCreditsResponse = { cast: [], crew: [] };

    service.getMovieDetails(movieId).subscribe(([details, credits]) => {
      expect(details).toEqual(dummyDetailsResponse);
      expect(credits).toEqual(dummyCreditsResponse);
    });

    const detailsRequest = httpMock.expectOne(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
    expect(detailsRequest.request.method).toBe('GET');
    detailsRequest.flush(dummyDetailsResponse);

    const creditsRequest = httpMock.expectOne(`${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
    expect(creditsRequest.request.method).toBe('GET');
    creditsRequest.flush(dummyCreditsResponse);
  });
});