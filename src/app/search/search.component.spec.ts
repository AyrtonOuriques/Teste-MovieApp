import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';
import { TmdbService } from '../tmdb.service';
import { MockProvider } from 'ng-mocks';
import { FormsModule } from '@angular/forms';
import { MovieDisplayComponent } from './movie-display/movie-display.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let tmdbService: jasmine.SpyObj<TmdbService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SearchComponent, MovieDisplayComponent],
      imports: [FormsModule],
      providers: [
        MockProvider(TmdbService, {
          searchMovies: jasmine.createSpy().and.returnValue(of({
            results: [{ id: 1, title: 'test' , release_date: '2020-01-01'}],
            page: 1,
            total_pages: 1,
            total_result: 10
          }))
        }),
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'test' } }
          }
        },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    tmdbService = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query from route and search movies', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.movieToSearch).toBe('test');
    expect(router.navigate).toHaveBeenCalledWith(['/search', 'test']);
    expect(tmdbService.searchMovies).toHaveBeenCalledWith('test', 1);
    expect(component.movies).toEqual([{ id: 1, title: 'test' , release_date: '2020-01-01'}]);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.spinnerActive).toBeFalse();
  });

  it('should search movies and update properties', () => {
    component.movieToSearch = 'test';
    component.searchMovieApi();
    fixture.detectChanges();

    expect(component.movies).toEqual([{ id: 1, title: 'test'  , release_date: '2020-01-01'}]);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.spinnerActive).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/search', 'test']);
  });
});