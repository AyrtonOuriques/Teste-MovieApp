import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MovieDetailComponent } from './movie-detail.component';
import { TmdbService } from '../../tmdb.service';
import { AuthService } from '../../auth.service';
import { MockProvider } from 'ng-mocks';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let tmdbService: jasmine.SpyObj<TmdbService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetailComponent],
      providers: [
        MockProvider(TmdbService, {
          getMovieDetails: () => of([{ id: '1', title: 'test', release_date: '2020-01-01',  genres: [{name: 'action'}] },
          { cast: [{name: 'bob'}], crew: [{name: 'bob', job: 'bob'}] }])
        }),
        MockProvider(AuthService, {
          checkAuth: () => true,
          getFavoriteMovies: () => of([{ id: 1, title: 'test', movieId: 123, release_date: '2020-01-01' , genres: [{name: 'action'}]}]),
          addFavoriteMovie: () => of({ id: 1 }),
          removeFavoriteMovie: () => of({})
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    tmdbService = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details and credits on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.movieDetails).toEqual({ id: '1', title: 'test', release_date: '2020-01-01', genres: [{name: 'action'}] });
    expect(component.movieCredits).toEqual({ cast: [{name: 'bob'}], crew: [{name: 'bob', job: 'bob'}] });
    expect(component.spinnerActive).toBeFalse();
  });

  it('should toggle favorite status', () => {
    component.isClicked = false;

    spyOn(component, 'addToFavorites');
    spyOn(component, 'removeFromFavorites');

    component.heartToggle();
    expect(component.isClicked).toBeTrue();
    expect(component.addToFavorites).toHaveBeenCalled();

    component.heartToggle();
    expect(component.isClicked).toBeFalse();
    expect(component.removeFromFavorites).toHaveBeenCalled();
  });

  it('should check if movie is favorited', () => {
    component.movieDetails = { id: 123 };
    component.checkIfMovieIsFavorited();
    fixture.detectChanges();

    expect(component.isClicked).toBeTrue();
    expect(component.favoriteMovieId).toBe(1);
  });

  it('should add movie to favorites', () => {
    component.movieDetails = { id: 123, title: 'test', release_date: '2024-01-01', poster_path: '/path.jpg' , genres: [{name: 'action'}]};
    component.addToFavorites();
    fixture.detectChanges();

    expect(component.favoriteMovieId).toBe(1);
  });

  it('should remove movie from favorites', () => {
    component.favoriteMovieId = 1;
    component.removeFromFavorites();
    fixture.detectChanges();

    expect(component.favoriteMovieId).toBeNull();
  });

});