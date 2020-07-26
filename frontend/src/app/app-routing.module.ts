import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./_helpers";

import { IndexComponent } from "./routes/index/index.component";
import { ProfileComponent } from "./routes/profile/profile.component";
import { VerifiedComponent } from "./components/pages/verified/verified.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";
import { OrganisationsComponent } from "./routes/organisations/organisations.component";
import { CreateOrgComponent } from "./routes/organisations/create-org/create-org.component";
import { DeviceListComponent } from "./components/device-list/device-list.component";
import { DeviceComponent } from "./components/device-list/device/device.component";
import { OrganisationComponent } from "./routes/organisations/organisation/organisation.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    children: [
      {
        path: "devices",
        component: DeviceListComponent,
        children: [
          {
            path: "**",
            component: DeviceComponent,
          },
        ],
      },
      // { path: "alerts", component: UserDevicesListComponent },
      // { path: "farms", component: UserDevicesListComponent },
      // { path: "racks", component: UserDevicesListComponent },
      // { path: "crops", component: UserDevicesListComponent },
      // { path: "users", component: UserDevicesListComponent },
    ],
  },

  { path: "verified", component: VerifiedComponent, canActivate: [AuthGuard] },
  {
    path: "orgs",
    component: OrganisationsComponent,
    children: [
      { path: "create", component: CreateOrgComponent },
      { path: ":org_id", component: OrganisationComponent },
    ],
  },
  {
    path: ":username",
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "ignore",
      paramsInheritanceStrategy: "always",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
