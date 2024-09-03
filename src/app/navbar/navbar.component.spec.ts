import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserName', 'isAuthenticated$']);

    authServiceSpy.isAuthenticated$ = of(true);
    authServiceSpy.getCurrentUserName.and.returnValue('testuser');

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [MatIconModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set `isAuthenticated` to true and `currentUser` to the username on initialization', () => {
    component.ngOnInit();
    expect(authService.isAuthenticated$).toBeTruthy();
    expect(authService.getCurrentUserName).toHaveBeenCalled();
    expect(component.isAuthenticated).toBeTrue();
    expect(component.currentUser).toBe('testuser');
  });
});