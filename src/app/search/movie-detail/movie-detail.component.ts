import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../tmdb.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      height: 85vh;
      background-color: black;
      z-index: -1;
      position: relative;
    }
  `]
  
})
export class MovieDetailComponent implements OnInit{

  movieDetails: any;
  movieCredits: any;
  vote_average: number = 0;

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId)
    {
      this.tmdbService.getMovieDetails(movieId).subscribe(([movieDetails, movieCredits]) => {
        console.log(movieDetails);
        console.log(movieCredits);
        this.movieDetails = movieDetails;
        this.movieCredits = movieCredits;
        this.vote_average = Math.round(movieDetails.vote_average*10);
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
    return this.movieCredits.crew.find((element: any) => element.known_for_department === "Directing").name
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
