import { CookieService } from "ngx-cookie-service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { UiLibModule } from "./ui-lib/ui-lib.module";
import { AngularMaterialModule } from "./angular-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { HighchartsChartModule } from "highcharts-angular";
import { HttpClientModule } from "@angular/common/http";
import { MomentModule } from "ngx-moment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicComponentModule, DynamicIoModule } from "ng-dynamic-component";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ClickOutsideModule } from "ng-click-outside";
import { CrystalLightboxModule } from "@crystalui/angular-lightbox";
import { PopoverModule } from "../assets/popover";

import { AppComponent } from "./app.component";

import { LoginComponent } from "./components/landing/login/login.component";
import { RegisterComponent } from "./components/landing/register/register.component";
import { FirstTimeSetupComponent } from "./components/landing/first-time-setup/first-time-setup.component";

import { VerifiedComponent } from "./components/pages/verified/verified.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";

import { WrapperComponent } from "./components/app/wrapper/wrapper.component";
import { HeaderBarComponent } from "./components/app/header-bar/header-bar.component";
import { SidebarComponent } from "./components/app/sidebar/sidebar.component";

import { DeviceComponent } from "./components/device-list/device/device.component";
import { ScheduledTasksComponent } from "./components/device-list/device/scheduled-tasks/scheduled-tasks.component";
import { DeviceControlComponent } from "./components/device-list/device/device-control/device-control.component";
import { PropertyListComponent } from "./components/device-list/device/property-list/property-list.component";

import { ProfileComponent } from "./routes/profile/profile.component";

import { DocumentationComponent } from "./routes/documentation/documentation.component";
import { HeaderBarUserMenuComponent } from "./components/app/header-bar/header-bar-user-menu/header-bar-user-menu.component";
import { FooterComponent } from "./components/app/footer/footer.component";
import { SidebarNavComponent } from "./components/app/sidebar/sidebar-nav/sidebar-nav.component";
import { TreeNodeComponent } from "./components/app/sidebar/sidebar-nav/tree-node/tree-node.component";
import { IndexComponent } from "./routes/index/index.component";
import { OrganisationsComponent } from "./routes/organisations/organisations.component";
import { PageComponent } from "./components/app/page/page.component";
import { CreateOrgComponent } from "./routes/organisations/create-org/create-org.component";
import { DeviceListComponent } from "./components/device-list/device-list.component";
import { OrganisationComponent } from "./routes/organisations/organisation/organisation.component";
import { HeaderUserButtonComponent } from "./components/app/header-bar/header-user-button/header-user-button.component";
import { FarmListComponent } from "./components/farm-list/farm-list.component";

import { CatalogComponent } from "./routes/catalog/catalog.component";
import { SpeciesListComponent } from "./routes/catalog/species-list/species-list.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    VerifiedComponent,
    FirstTimeSetupComponent,
    HeaderBarComponent,
    WrapperComponent,
    NotFoundComponent,
    SidebarComponent,
    DeviceComponent,
    DocumentationComponent,
    HeaderBarUserMenuComponent,
    ScheduledTasksComponent,
    DeviceControlComponent,
    FooterComponent,
    PropertyListComponent,
    SidebarNavComponent,
    TreeNodeComponent,
    IndexComponent,
    OrganisationsComponent,
    PageComponent,
    CreateOrgComponent,
    DeviceListComponent,
    OrganisationComponent,
    HeaderUserButtonComponent,
    FarmListComponent,
    CatalogComponent,
    SpeciesListComponent,
  ],
  imports: [
    AngularMaterialModule,
    UiLibModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DynamicComponentModule,
    DynamicIoModule,
    MomentModule,
    PickerModule,
    ClickOutsideModule,
    CrystalLightboxModule,
    PopoverModule,
    HighchartsChartModule,
  ],
  providers: [CookieService],
  entryComponents: [HeaderBarUserMenuComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
