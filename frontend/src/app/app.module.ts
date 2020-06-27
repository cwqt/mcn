import { CookieService } from "ngx-cookie-service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { MomentModule } from "ngx-moment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicComponentModule, DynamicIoModule } from "ng-dynamic-component";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ClickOutsideModule } from "ng-click-outside";
import { CrystalLightboxModule } from "@crystalui/angular-lightbox";
import { PopoverModule } from "../assets/popover";

import { LoginComponent } from "./components/landing/login/login.component";
import { RegisterComponent } from "./components/landing/register/register.component";
import { FirstTimeSetupComponent } from "./components/landing/first-time-setup/first-time-setup.component";

import { VerifiedComponent } from "./components/pages/verified/verified.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";

import { WrapperComponent } from "./components/app/wrapper/wrapper.component";
import { HeaderBarComponent } from "./components/app/header-bar/header-bar.component";
import { SidebarComponent } from "./components/app/sidebar/sidebar.component";

import { LoadButtonComponent } from "./components/_helpers/load-button/load-button.component";
import { RoundedButtonComponent } from "./components/_helpers/rounded-button/rounded-button.component";
import { LoadablePanelComponent } from "./components/_helpers/loadable-panel/loadable-panel.component";

import { DeviceComponent } from "./routes/device/device.component";
import { ScheduledTasksComponent } from "./routes/device/scheduled-tasks/scheduled-tasks.component";
import { DeviceControlComponent } from "./routes/device/device-control/device-control.component";

import { ProfileComponent } from "./routes/profile/profile.component";

import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";

import { ChartsModule } from "@carbon/charts-angular";
import {
  InputModule,
  LoadingModule,
  InlineLoadingModule,
  ButtonModule,
  TabsModule,
  TilesModule,
  TagModule,
  ToggleModule,
  NumberModule,
  Table,
  TableModule,
  DialogModule,
  StructuredListModule,
  UIShellModule,
} from "carbon-components-angular";

import { DocumentationComponent } from "./routes/documentation/documentation.component";
import { HeaderBarUserMenuComponent } from "./components/app/header-bar/header-bar-user-menu/header-bar-user-menu.component";
import { FooterComponent } from "./components/app/footer/footer.component";
import { SensorListComponent } from "./routes/device/sensor-list/sensor-list.component";
import { SidebarNavComponent } from "./components/app/sidebar/sidebar-nav/sidebar-nav.component";
import { TreeNodeComponent } from "./components/app/sidebar/sidebar-nav/tree-node/tree-node.component";
import { IndexComponent } from "./routes/index/index.component";
import { OrganisationsComponent } from "./routes/organisations/organisations.component";
import { PageComponent } from "./components/app/page/page.component";
import { CreateOrgComponent } from "./routes/organisations/create-org/create-org.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    VerifiedComponent,
    FirstTimeSetupComponent,
    HeaderBarComponent,
    LoadButtonComponent,
    WrapperComponent,
    NotFoundComponent,
    SidebarComponent,
    DeviceComponent,
    RoundedButtonComponent,
    DocumentationComponent,
    HeaderBarUserMenuComponent,
    LoadablePanelComponent,
    ScheduledTasksComponent,
    DeviceControlComponent,
    FooterComponent,
    SensorListComponent,
    SidebarNavComponent,
    TreeNodeComponent,
    IndexComponent,
    OrganisationsComponent,
    PageComponent,
    CreateOrgComponent,
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
    CrystalLightboxModule,
    PopoverModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTableModule,
    MatProgressBarModule,
    MatChipsModule,
    MatPaginatorModule,

    ChartsModule,
    InputModule,
    LoadingModule,
    InlineLoadingModule,
    ButtonModule,
    TabsModule,
    TilesModule,
    TagModule,
    ToggleModule,
    NumberModule,
    TableModule,
    DialogModule,
    StructuredListModule,
    UIShellModule,
  ],
  providers: [CookieService],
  entryComponents: [Table, HeaderBarUserMenuComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
