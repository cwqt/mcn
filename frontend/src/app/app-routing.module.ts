import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';

import { IndexComponent }     from './routes/index/index.component';
import { HomeComponent }      from './routes/home/home.component';
import { ProfileComponent }   from './routes/profile/profile.component';
import { VerifiedComponent }  from './components/pages/verified/verified.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'verified', component: VerifiedComponent},
  {
    path: 'u/:username',
    component: ProfileComponent,
    children: [
      // { path: '', component: PlantItemComponent},
      // { path: 'plants', component: PlantItemComponent},
      // { path: 'gardens', component: PlantItemComponent},
      // { path: 'devices', component: PlantItemComponent},
    ]
  },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
