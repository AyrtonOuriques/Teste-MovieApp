import { Component } from '@angular/core';
import { TmdbService } from '../tmdb.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  movieToSearch: string = '';
  movies: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(private tmdbService: TmdbService) {}

  searchMovieApi() {
    this.tmdbService.searchMovies(this.movieToSearch, this.currentPage).subscribe((data) => {
      console.log(data);
      this.movies = data.results;
      this.currentPage = data.page;
      this.totalPages = data.total_pages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1
      this.searchMovieApi();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.searchMovieApi();
    }
  }
}
