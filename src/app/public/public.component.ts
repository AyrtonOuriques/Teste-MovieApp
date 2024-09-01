import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent implements OnInit{

  movies: any[] = [];

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
        const currentUser = this.route.snapshot.paramMap.get('user');
        if (currentUser) {
          this.authService.getPublicFavoriteMovies(currentUser).subscribe(
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
