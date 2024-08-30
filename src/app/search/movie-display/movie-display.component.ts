import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrl: './movie-display.component.css'
})
export class MovieDisplayComponent {
  @Input() movies: any[] = [];

  constructor(private router: Router) {}
  
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

}
