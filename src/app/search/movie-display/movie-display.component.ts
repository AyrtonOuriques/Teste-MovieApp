import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrl: './movie-display.component.css'
})
export class MovieDisplayComponent implements OnInit {
  @Input() movies: any[] = [];
  removeFlag: number = 0;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

    if (this.router.url === '/favorite-movies') {
      this.removeFlag = 1;
      this.authService.getFavoriteMovies().subscribe(
        favoriteMovies => {
          console.log(favoriteMovies)
          this.movies = favoriteMovies;
        },
        error => {
          console.error('Failed to fetch favorite movies', error);
        }
      );
    }
  }
  
  removeMovie(event: Event, index: number) {
    console.log(this.movies[index].movieId)
    event.stopPropagation();
    this.authService.removeFavoriteMovie(this.movies[index].id).subscribe(
      response => {
        console.log('Movie removed from favorites', response);
        location.reload()
      },
      error => {
        console.error('Failed to remove movie from favorites', error);
      }
    );
  }

  goToMovieDetails(index: number) {
    if (this.router.url === '/favorite-movies') {
      this.router.navigate(['/movie',  this.movies[index].movieId]);
    }
    else{
      this.router.navigate(['/movie', this.movies[index].id]);
    }
  }

}
