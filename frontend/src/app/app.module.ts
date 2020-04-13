import { CookieService } from 'ngx-cookie-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { HomeComponent }            from './routes/home/home.component';

import { ProfileComponent }         from './routes/profile/profile.component';
import { ProfileSidebarComponent }  from './components/profile/profile-sidebar/profile-sidebar.component';
import { RecordableCountComponent } from './components/profile/recordable-count/recordable-count.component';
import { UserPostsListComponent }   from './components/profile/tabs/user-posts-list/user-posts-list.component';
import { UserPlantsListComponent }  from './components/profile/tabs/user-plants-list/user-plants-list.component';
import { UserGardensListComponent } from './components/profile/tabs/user-gardens-list/user-gardens-list.component';
import { UserDevicesListComponent } from './components/profile/tabs/user-devices-list/user-devices-list.component';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule

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
