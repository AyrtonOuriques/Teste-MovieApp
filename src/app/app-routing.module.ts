import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieDetailComponent } from './search/movie-detail/movie-detail.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
