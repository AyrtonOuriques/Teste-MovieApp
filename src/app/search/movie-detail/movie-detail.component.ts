import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../tmdb.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      height: 85vh;
    }
  `]
  
})
export class MovieDetailComponent implements OnInit{

  movieDetails: any;
  movieCredits: any;

  vote_average: number = 0;

  favoriteMovieId: number | null = null;

  isClicked = false;

  spinnerActive = false;

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService, private authService: AuthService) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId)
    {
      this.spinnerActive = true;
      this.tmdbService.getMovieDetails(movieId).subscribe(([movieDetails, movieCredits]) => {
        console.log(movieDetails);
        console.log(movieCredits);
        this.movieDetails = movieDetails;
        this.movieCredits = movieCredits;
        this.vote_average = Math.round(movieDetails.vote_average*10);
        if (localStorage.getItem('token')){
          this.checkIfMovieIsFavorited(); 
        }
        this.spinnerActive = false;
      });
    }
  }


  getMovieGenres() {
    return this.movieDetails.genres.map((element: any) => element.name);
  }

  getMovieCast() {
    return this.movieCredits.cast.slice(0, 3).map((element: any) => element.name);
  }

  getMovieDirector() {
    return this.movieCredits.crew.find((element: any) => element.job === "Director").name
  }



  heartToggle() {
    if (this.authService.checkAuth('')) {
      this.isClicked = !this.isClicked;
      if (this.isClicked) {
        this.addToFavorites();
      } else {
        this.removeFromFavorites();
      }
    }
  }

  checkIfMovieIsFavorited() {
    this.authService.getFavoriteMovies().subscribe(
      favoriteMovies => {
        console.log(favoriteMovies)
        const favoriteMovie = favoriteMovies.find((movie: any) => movie.movieId === this.movieDetails.id);
        if (favoriteMovie) {
          this.isClicked = true;
          this.favoriteMovieId = favoriteMovie.id; 
        }
      },
      error => {
        console.error('Failed to fetch favorite movies', error);
      }
    );
  }

  addToFavorites() {
    const movieData = {
      movieId: this.movieDetails.id,
      title: this.movieDetails.title,
      release_date: this.movieDetails.release_date,
      poster_path: this.movieDetails.poster_path  
    };

    this.authService.addFavoriteMovie(movieData).subscribe(
      response => {
        console.log('Movie added to favorites', response);
        this.favoriteMovieId = response.id;
      },
      error => {
        console.error('Failed to add movie to favorites', error);
      }
    );
  }

  removeFromFavorites() {
    if (this.favoriteMovieId) {
      this.authService.removeFavoriteMovie(this.favoriteMovieId).subscribe(
        response => {
          console.log('Movie removed from favorites', response);
          this.favoriteMovieId = null;
        },
        error => {
          console.error('Failed to remove movie from favorites', error);
        }
      );
    }
  }
  
  getCircleColor() {
    if (this.vote_average >= 70) {
      return 'circular-chart green';
    } else if (this.vote_average >= 40 && this.vote_average < 70) {
      return 'circular-chart orange';
    } else {
      return 'circular-chart red';
    }
  }
}
