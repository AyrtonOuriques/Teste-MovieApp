import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent implements OnInit{

  movies: any[] = [];
  spinnerActive = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.spinnerActive = true;
    const currentUser = this.route.snapshot.paramMap.get('user');
    if (currentUser) {
      this.authService.getPublicFavoriteMovies(currentUser)
       .pipe(finalize(() => this.spinnerActive = false))
       .subscribe(
        (data) => {
          this.movies = data;
        },
        (error) => {
          console.error('Error fetching public favorite movies', error);
        }
      );
    }
  }
}
