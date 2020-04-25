import { CookieService }  from 'ngx-cookie-service';
import { BrowserModule }  from '@angular/platform-browser';
import { NgModule }       from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule }     from 'ngx-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicComponentModule, DynamicIoModule } from 'ng-dynamic-component';

import { IndexComponent }           from './routes/index/index.component';
import { LoginComponent }           from './components/index/login/login.component';
import { RegisterComponent }        from './components/index/register/register.component';
import { LoginHelpComponent }       from './components/index/login-help/login-help.component';
import { FirstTimeSetupComponent }  from './components/index/first-time-setup/first-time-setup.component';


import { VerifiedComponent }        from './components/pages/verified/verified.component';
import { NotFoundComponent }        from './components/pages/not-found/not-found.component';

import { WrapperComponent }         from './components/app/wrapper/wrapper.component';
import { HeaderBarComponent }       from './components/app/header-bar/header-bar.component';

import { LoadButtonComponent }      from './components/_helpers/load-button/load-button.component';

import { FeedComponent }            from './routes/feed/feed.component';

import { ProfileComponent }         from './routes/profile/profile.component';
import { ProfileSidebarComponent }  from './components/profile/profile-sidebar/profile-sidebar.component';
import { RecordableCountComponent } from './components/profile/recordable-count/recordable-count.component';
import { UserPostsListComponent }   from './components/profile/tabs/user-posts-list/user-posts-list.component';
import { UserPlantsListComponent }  from './components/profile/tabs/user-plants-list/user-plants-list.component';
import { UserGardensListComponent } from './components/profile/tabs/user-gardens-list/user-gardens-list.component';
import { UserDevicesListComponent } from './components/profile/tabs/user-devices-list/user-devices-list.component';
import { PlantItemComponent }       from './components/profile/tabs/user-plants-list/plant-item/plant-item.component';
import { PostComponent }            from './components/profile/tabs/user-posts-list/post/post.component';
import { PostThumbComponent }       from './components/profile/tabs/user-posts-list/post-thumb/post-thumb.component';

import { MatButtonModule }        from '@angular/material/button';
import { MatButtonToggleModule }  from '@angular/material/button-toggle';
import { MatInputModule }         from '@angular/material/input';
import { MatDividerModule }       from '@angular/material/divider';
import { MatCheckboxModule }      from '@angular/material/checkbox';
import { MatStepperModule }       from '@angular/material/stepper';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatTabsModule }          from '@angular/material/tabs';
import {MatCardModule}            from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedSidebarComponent } from './components/feed/feed-sidebar/feed-sidebar.component';



@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    ProfileComponent,
    VerifiedComponent,
    LoginHelpComponent,
    FirstTimeSetupComponent,
    ProfileSidebarComponent,
    HeaderBarComponent,
    LoadButtonComponent,
    WrapperComponent,
    RecordableCountComponent,
    NotFoundComponent,
    UserPostsListComponent,
    UserPlantsListComponent,
    UserGardensListComponent,
    UserDevicesListComponent,
    PlantItemComponent,
    PostComponent,
    PostThumbComponent,
    FeedSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DynamicComponentModule,
    DynamicIoModule,
    MomentModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule

  ],
  providers: [
    CookieService
  ],
  entryComponents: [
    UserPostsListComponent,
    UserPlantsListComponent,
    UserGardensListComponent,
    UserDevicesListComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
