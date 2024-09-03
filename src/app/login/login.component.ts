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
  spinnerActive = false;
  error = '';
  

  constructor(private authService: AuthService, private route: ActivatedRoute ,  private router: Router) { }

  login() {
    this.spinnerActive = true;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.authService.login(this.username, this.password, returnUrl).subscribe(
      response => {
        console.log('User logged in successfully', response);
      },
      error => {
        this.spinnerActive = false;
        console.error('Login failed', error)
        this.error = error.error.detail;
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
