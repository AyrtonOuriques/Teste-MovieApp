import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicComponent } from './public.component';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MovieDisplayComponent } from '../search/movie-display/movie-display.component';

describe('PublicComponent', () => {
  let component: PublicComponent;
  let fixture: ComponentFixture<PublicComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getPublicFavoriteMovies']);
    authServiceSpy.getPublicFavoriteMovies.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [PublicComponent,MovieDisplayComponent],
      imports: [MatIconModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'testuser' } }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch public favorite movies on initialization', () => {
    const dummyMovies = [{ title: 'test' , release_date: '2020-01-01'}];
    authService.getPublicFavoriteMovies.and.returnValue(of(dummyMovies));
    
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.spinnerActive).toBeFalse();
    expect(component.movies).toEqual(dummyMovies);
    expect(authService.getPublicFavoriteMovies).toHaveBeenCalledWith('testuser');
  });
});