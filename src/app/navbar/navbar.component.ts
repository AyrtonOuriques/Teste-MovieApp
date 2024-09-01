import { Component , OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  isAuthenticated = false;
  
  constructor( private authService: AuthService,  private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  goToHomePage() {
    this.router.navigate(['']);
  }
  
  goToFavoriteList() {
    this.router.navigate(['/favorite-movies']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

}
