import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './routes/index/index.component';
import { VerifiedComponent } from './components/verified/verified.component';

import { AuthGuard } from './_helpers';
import { HomeComponent } from './routes/home/home.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'verified', component: VerifiedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
