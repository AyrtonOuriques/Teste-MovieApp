import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private route: ActivatedRoute ,  private router: Router) { }

  login() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.authService.login(this.username, this.password, returnUrl).subscribe(
      response => {
        console.log('User logged in successfully', response);
        this.authService.setCurrentUser(this.username)
      },
      error => console.error('Login failed', error)
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
