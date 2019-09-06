import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalContainerComponent } from './personal-container/personal-container.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { AddressesComponent } from './addresses/addresses.component';
import { PersonalAccountRoutes } from './personal-account-routing.module';
import { TabsModule } from 'ngx-tabset';
import { GlobalsModule } from '../shared/globals/globals.module';
import { DropdownModule } from 'ngx-dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';

@NgModule({
  declarations: [PersonalContainerComponent, ProfileComponent, OrdersComponent, AddressesComponent],
  imports: [
    CommonModule,
    PersonalAccountRoutes,
    GlobalsModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule, 
    NgSelectModule,
    TranslateModule,
    LocalizeRouterModule,
    TabsModule.forChild(),
    LocalizeRouterModule
  ]
})
export class PersonalAccountModule { }
