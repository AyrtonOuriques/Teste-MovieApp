import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  movieToSearch: string = '';
  movies: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(private tmdbService: TmdbService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const query = this.route.snapshot.paramMap.get('query');
    if (query != null) {
      this.movieToSearch = query;
      this.router.navigate(['/search', this.movieToSearch]);
      this.searchMovieApi();
    }
  }

  searchMovieApi() {
    this.tmdbService.searchMovies(this.movieToSearch, this.currentPage).subscribe((data) => {
      console.log(data);
      this.movies = data.results;
      this.currentPage = data.page;
      this.totalPages = data.total_pages;
    });
    this.router.navigate(['/search', this.movieToSearch]);
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
