import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';

import { IndexComponent }     from './routes/index/index.component';
import { FeedComponent }      from './components/feed/feed.component';
import { ProfileComponent }   from './routes/profile/profile.component';
import { VerifiedComponent }  from './components/pages/verified/verified.component';
import { NotFoundComponent }  from './components/pages/not-found/not-found.component';
import { PostComponent }      from './components/profile/tabs/user-posts-list/post/post.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard]},
  { path: 'verified', component: VerifiedComponent, canActivate: [AuthGuard]},
  {
    path: ':username',
    component: ProfileComponent, canActivate: [AuthGuard],
    children: [
      { path: 'posts/:pid', component: PostComponent },
      // { path: 'plants/:pid', component: PostComponent },
      // { path: 'gardens/:gid', component: PostComponent },
      // { path: 'devices/:did', component: PostComponent },
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
