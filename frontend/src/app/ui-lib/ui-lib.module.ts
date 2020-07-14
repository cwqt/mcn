import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";
import { ClickOutsideModule } from "ng-click-outside";

import { LoadablePanelComponent } from "./loadable-panel/loadable-panel.component";
import { ButtonMenuComponent } from "./button-menu/button-menu.component";
import { ButtonComponent } from "./button/button.component";
import { IconComponent } from "./icon/icon.component";
import { TestbedComponent } from "./testbed/testbed.component";
import { IconButtonComponent } from "./icon-button/icon-button.component";
import { OverflowMenuComponent } from "./overflow-menu/overflow-menu.component";
import { SectionHeaderComponent } from "./section-header/section-header.component";

const allComponents = [
  LoadablePanelComponent,
  ButtonMenuComponent,
  ButtonComponent,
  IconComponent,
  TestbedComponent,
  IconButtonComponent,
  OverflowMenuComponent,
  SectionHeaderComponent,
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
