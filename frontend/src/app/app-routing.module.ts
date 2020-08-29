import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./_helpers";

import { IndexComponent } from "./routes/index/index.component";
import { ProfileComponent } from "./routes/profile/profile.component";
import { OrganisationComponent } from "./routes/organisations/organisation/organisation.component";
import { CatalogComponent } from "./routes/catalog/catalog.component";
import { OrganisationsComponent } from "./routes/organisations/organisations.component";
import { CreateOrgComponent } from "./routes/organisations/create-org/create-org.component";

import { VerifiedComponent } from "./components/pages/verified/verified.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";
import { SpeciesListComponent } from "./routes/catalog/species-list/species-list.component";
import { DashboardComponent } from "./routes/index/dashboard/dashboard.component";

import { DevicesComponent } from "./routes/index/devices/devices.component";
import { DeviceComponent } from "./routes/index/devices/device/device.component";
import { FarmComponent } from "./routes/index/farms/farm/farm.component";
import { FarmsComponent } from "./routes/index/farms/farms.component";
import { RacksComponent } from "./routes/index/farms/racks/racks.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    children: [
      {
        path: "devices",
        component: DevicesComponent,
        children: [
          {
            path: ":did",
            component: DeviceComponent,
          },
        ],
      },
      {
        path: "farms",
        component: FarmsComponent,
        children: [
          {
            path: ":fid",
            component: FarmComponent,
            children: [
              {
                path: "racks",
                component: RacksComponent,
              },
              // {
              //   path: "measurements",
              //   component: RacksComponent,
              // },
              // {
              //   path: "agenda",
              //   component: AgendaComponent,
              // },
            ],
          },
        ],
      },
      {
        path: "",
        component: DashboardComponent,
      },
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
    path: "catalog",
    component: CatalogComponent,
    children: [
      { path: "species", component: SpeciesListComponent },
      { path: "devices", component: SpeciesListComponent },
    ],
  },
  {
    path: "user/:username",
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
