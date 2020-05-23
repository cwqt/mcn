import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';

import { IndexComponent }     from './routes/index/index.component';
import { ProfileComponent }   from './routes/profile/profile.component';
import { VerifiedComponent }  from './components/pages/verified/verified.component';
import { NotFoundComponent }  from './components/pages/not-found/not-found.component';
import { PostComponent }      from './routes/post/post.component';
import { SupportedDevicesComponent } from './components/pages/supported-devices/supported-devices.component';
import { DeviceComponent } from './routes/device/device.component';
import { PlantComponent } from './routes/plant/plant.component';
import { DocumentationComponent } from './routes/documentation/documentation.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'verified', component: VerifiedComponent, canActivate: [AuthGuard]},
  { path: 'supported_devices', component: SupportedDevicesComponent, canActivate: [AuthGuard]},
  { path: 'documentation', component: DocumentationComponent },
  {
    path: ':username',
    component: ProfileComponent, canActivate: [AuthGuard],
    children: [
      { path: 'posts/:pid',   component: PostComponent },
      { path: 'devices/:did', component: DeviceComponent },
      { path: 'plants/:rid',  component: PlantComponent },
      // { path: 'gardens/:gid', component: PostComponent },
    ]
  },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore',
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
