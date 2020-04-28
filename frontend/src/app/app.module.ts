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
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideModule } from 'ng-click-outside';

import { IndexComponent }           from './routes/index/index.component';
import { LoginComponent }           from './components/landing/login/login.component';
import { RegisterComponent }        from './components/landing/register/register.component';
import { LoginHelpComponent }       from './components/landing/login-help/login-help.component';
import { FirstTimeSetupComponent }  from './components/landing/first-time-setup/first-time-setup.component';


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
import { CreatePostFormComponent }  from './components/profile/tabs/user-posts-list/create-post-form/create-post-form.component';
import { ProfileSidebarQuadComponent } from './components/profile/profile-sidebar/profile-sidebar-quad/profile-sidebar-quad.component';

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
import { SidebarComponent } from './components/app/sidebar/sidebar.component';


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
    SidebarComponent,
    CreatePostFormComponent,
    ProfileSidebarQuadComponent,
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
    PickerModule,
    ClickOutsideModule,

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
