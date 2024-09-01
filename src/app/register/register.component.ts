import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService ,  private router: Router) { }

  register() {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        console.log('User registered successfully', response)
        this.router.navigate(['/login']); 
      },error => console.error('Registration failed', error)
    );
  }
}
