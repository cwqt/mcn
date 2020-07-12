import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";
import { ClickOutsideModule } from "ng-click-outside";

import { LoadButtonComponent } from "./load-button/load-button.component";
import { LoadablePanelComponent } from "./loadable-panel/loadable-panel.component";
import { ButtonMenuComponent } from "./button-menu/button-menu.component";
import { ButtonComponent } from "./button/button.component";
import { IconComponent } from "./icon/icon.component";
import { TestbedComponent } from "./testbed/testbed.component";
import { IconButtonComponent } from "./icon-button/icon-button.component";

const allComponents = [
  LoadButtonComponent,
  LoadablePanelComponent,
  ButtonMenuComponent,
  ButtonComponent,
  IconComponent,
  TestbedComponent,
  IconButtonComponent,
];

@NgModule({
  declarations: [allComponents],
  imports: [CommonModule, AngularMaterialModule, ClickOutsideModule],
  exports: [allComponents],
  providers: [],
  entryComponents: [],
  bootstrap: [],
})
export class UiLibModule {}
