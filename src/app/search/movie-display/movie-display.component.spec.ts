import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MovieDisplayComponent } from './movie-display.component';
import { AuthService } from '../../auth.service';
import { MockProvider } from 'ng-mocks';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { MatIconModule } from '@angular/material/icon';

describe('MovieDisplayComponent', () => {
  let component: MovieDisplayComponent;
  let fixture: ComponentFixture<MovieDisplayComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      declarations: [MovieDisplayComponent],
      imports: [
        MatTooltipModule,
        ClipboardModule,
        MatIconModule,
      ],
      providers: [
        MockProvider(AuthService, {
          getFavoriteMovies: () => of([{ id: 1, title: 'test', movieId: 123, release_date: '2020-01-01' }]),
          removeFavoriteMovie: jasmine.createSpy().and.returnValue(of({})),
          getCurrentUserName: () => 'testUser'
        }),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDisplayComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch favorite movies on init if currentUrl is /favorite-movies', () => {
    component.movies = [{ id: 1, title: 'test', movieId: 123, release_date: '2020-01-01' }];
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.movies).toEqual([{ id: 1, title: 'test', movieId: 123, release_date: '2020-01-01' }]);
    expect(component.spinnerActive).toBeFalse();
  });

  it('should remove movie from favorites', () => {
    component.movies = [{ id: 1, title: 'test', movieId: 123, release_date: '2020-01-01' }];
    component.removeMovie(new Event('click'), 0);
    fixture.detectChanges();

    expect(authService.removeFavoriteMovie).toHaveBeenCalledWith(1);
    expect(component.spinnerActive).toBeFalse();
  });
});