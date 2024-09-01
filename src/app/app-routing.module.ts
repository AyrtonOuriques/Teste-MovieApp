import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieDetailComponent } from './search/movie-detail/movie-detail.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MovieDisplayComponent } from './search/movie-display/movie-display.component';
import { authGuard } from './auth.guard';
import { PublicComponent } from './public/public.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: SearchComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'public/:user', component: PublicComponent },
  {
    path: 'favorite-movies',
    component: MovieDisplayComponent,
    canActivate: [authGuard]
  },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
