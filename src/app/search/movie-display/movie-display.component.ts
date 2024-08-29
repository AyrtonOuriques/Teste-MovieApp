import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrl: './movie-display.component.css'
})
export class MovieDisplayComponent {
  @Input() movies: any[] = [];
  
}
