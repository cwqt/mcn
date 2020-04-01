import { CookieService } from 'ngx-cookie-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './routes/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './routes/home/home.component';
import { ProfileComponent } from './routes/profile/profile.component';
import { VerifiedComponent } from './components/verified/verified.component';
import { LoginHelpComponent } from './components/login-help/login-help.component';
import { FirstTimeSetupComponent } from './components/first-time-setup/first-time-setup.component';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule, MatIcon} from '@angular/material/icon';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';



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
    MatIconModule

  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
