import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrl: './movie-display.component.css'
})
export class MovieDisplayComponent implements OnInit {
  @Input() movies: any[] = [];
  removeFlag: number = 0;
  spinnerActive = false;
  currentUrl = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url
    if ( this.currentUrl  === '/favorite-movies') {
      this.getFavoriteMovies();
    }
  }

  getFavoriteMovies(){
    this.spinnerActive = true;
    this.removeFlag = 1;
    this.authService.getFavoriteMovies()
    .pipe(finalize(() => this.spinnerActive = false))
    .subscribe(
      favoriteMovies => {
        console.log(favoriteMovies)
        this.movies = favoriteMovies;
      },
      error => {
        console.error('Failed to fetch favorite movies', error);
      }
    );
  }
  
  removeMovie(event: Event, index: number) {
    this.spinnerActive = true;
    event.stopPropagation();
    this.authService.removeFavoriteMovie(this.movies[index].id).subscribe(
      response => {
        console.log('Movie removed from favorites', response);
        this.getFavoriteMovies();
      },
      error => {
        console.error('Failed to remove movie from favorites', error);
        this.spinnerActive = false;
      }
    );
  }

  goToMovieDetails(index: number) {
    if (this.currentUrl=== '/favorite-movies' || this.currentUrl.startsWith('/public/')) {
      this.router.navigate(['/movie',  this.movies[index].movieId]);
    }
    else{
      this.router.navigate(['/movie', this.movies[index].id]);
    }
  }

  getSharedLink(): string {
    const currentUser = "/public/" + this.authService.getCurrentUserName();
    return (window.location.href.replace('/favorite-movies',currentUser ))
  }
}
