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

import { IndexComponent } from "./routes/index/index.component";
import { LoginComponent } from "./components/landing/login/login.component";
import { RegisterComponent } from "./components/landing/register/register.component";
import { LoginHelpComponent } from "./components/landing/login-help/login-help.component";
import { FirstTimeSetupComponent } from "./components/landing/first-time-setup/first-time-setup.component";

import { VerifiedComponent } from "./components/pages/verified/verified.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";

import { WrapperComponent } from "./components/app/wrapper/wrapper.component";
import { HeaderBarComponent } from "./components/app/header-bar/header-bar.component";
import { SidebarComponent } from "./components/app/sidebar/sidebar.component";
import { RepostDialogComponent } from "./components/app/repost-dialog/repost-dialog.component";

import { LoadButtonComponent } from "./components/_helpers/load-button/load-button.component";
import { RoundedButtonComponent } from "./components/_helpers/rounded-button/rounded-button.component";
import { LoadablePanelComponent } from "./components/_helpers/loadable-panel/loadable-panel.component";

import { PostableRepostMenuPopoverComponent } from "./components/app/postable/postable-repost-menu-popover/postable-repost-menu-popover.component";
import { PostableSocialActionsComponent } from "./components/app/postable/postable-social-actions/postable-social-actions.component";

import { DeviceComponent } from "./routes/device/device.component";
import { ScheduledTasksComponent } from "./routes/device/scheduled-tasks/scheduled-tasks.component";
import { DeviceControlComponent } from "./routes/device/device-control/device-control.component";

import { ProfileComponent } from "./routes/profile/profile.component";
import { RecordableCountComponent } from "./components/profile/recordable-count/recordable-count.component";
import { UserPostsListComponent } from "./components/profile/tabs/user-posts-list/user-posts-list.component";
import { UserPlantsListComponent } from "./components/profile/tabs/user-plants-list/user-plants-list.component";
import { UserGardensListComponent } from "./components/profile/tabs/user-gardens-list/user-gardens-list.component";
import { UserDevicesListComponent } from "./components/profile/tabs/user-devices-list/user-devices-list.component";
import { PlantThumbComponent } from "./components/profile/tabs/user-plants-list/plant-thumb/plant-thumb.component";
import { PostComponent } from "./routes/post/post.component";
import { PostThumbComponent } from "./components/profile/tabs/user-posts-list/post-thumb/post-thumb.component";
import { CreateDeviceGuideComponent } from "./components/profile/tabs/user-devices-list/create-device-guide/create-device-guide.component";
import { SupportedDevicesComponent } from "./components/pages/supported-devices/supported-devices.component";
import { DeviceThumbComponent } from "./components/profile/tabs/user-devices-list/device-thumb/device-thumb.component";
import { EditDeviceModalComponent } from "./components/profile/tabs/user-devices-list/edit-device-modal/edit-device-modal.component";

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

import { PlantComponent } from "./routes/plant/plant.component";
import { DocumentationComponent } from "./routes/documentation/documentation.component";
import { ThumbWrapperComponent } from "./components/profile/tabs/thumb-wrapper/thumb-wrapper.component";
import { HeaderBarUserMenuComponent } from "./components/app/header-bar/header-bar-user-menu/header-bar-user-menu.component";
import { PostableRepliesComponent } from "./components/app/postable/postable-replies/postable-replies.component";
import { FooterComponent } from "./components/app/footer/footer.component";
import { SensorListComponent } from "./routes/device/sensor-list/sensor-list.component";
import { SidebarNavComponent } from './components/app/sidebar/sidebar-nav/sidebar-nav.component';
import { TreeNodeComponent } from './components/app/sidebar/sidebar-nav/tree-node/tree-node.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    VerifiedComponent,
    LoginHelpComponent,
    FirstTimeSetupComponent,
    HeaderBarComponent,
    LoadButtonComponent,
    WrapperComponent,
    RecordableCountComponent,
    NotFoundComponent,
    UserPostsListComponent,
    UserPlantsListComponent,
    UserGardensListComponent,
    UserDevicesListComponent,
    PlantThumbComponent,
    PostComponent,
    PostThumbComponent,
    SidebarComponent,
    CreateDeviceGuideComponent,
    SupportedDevicesComponent,
    DeviceThumbComponent,
    DeviceComponent,
    EditDeviceModalComponent,
    RoundedButtonComponent,
    PlantComponent,
    DocumentationComponent,
    ThumbWrapperComponent,
    RepostDialogComponent,
    HeaderBarUserMenuComponent,
    PostableRepostMenuPopoverComponent,
    LoadablePanelComponent,
    PostableSocialActionsComponent,
    ScheduledTasksComponent,
    DeviceControlComponent,
    PostableRepliesComponent,
    FooterComponent,
    SensorListComponent,
    SidebarNavComponent,
    TreeNodeComponent,
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
  entryComponents: [
    Table,
    UserPostsListComponent,
    UserPlantsListComponent,
    UserGardensListComponent,
    UserDevicesListComponent,
    HeaderBarUserMenuComponent,
    PostableRepostMenuPopoverComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
