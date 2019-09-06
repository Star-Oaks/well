import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { CartComponent } from './cart/cart.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { RegistrationComponent } from './registration/registration.component';
import { FastWaterComponent } from './fast-water/fast-water.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DropdownModule } from "ngx-dropdown";
import { SidebarModule } from 'ng-sidebar';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { GlobalsModule } from '../globals/globals.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DegustationModalComponent } from './degustation-modal/degustation-modal.component';
import { LocalizeRouterModule } from '../localize/localize-router.module';
import { DirectivesModule } from '../directives/directives.module';
import { FooterService } from './footer/footer.service';
import { SidebarDataService } from './sidebar/sidebarData.service';
import { FastWatherService } from './fast-water/fast-water.service';
import { DegustationService } from './degustation-modal/degustation.service';
import { ErrorOrderComponent } from './error-order/error-order.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { GtagModule, GtagEventDirective } from 'angular-gtag';
import { LazyLoadImageModule }  from 'ng-lazyload-image';
import { NgxJsonLdModule } from 'ngx-json-ld';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { ShareService } from './share-modal/share.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    DropdownModule,
    SidebarModule,
    MalihuScrollbarModule.forRoot(),
    NgxSmartModalModule.forChild(),
    GlobalsModule,
    ReactiveFormsModule,
    FormsModule,
    LocalizeRouterModule,
    DirectivesModule,
    InlineSVGModule,
    GtagModule,
    LazyLoadImageModule,
    NgxJsonLdModule,
  ],
  declarations: [
    FooterComponent,
    SidebarComponent,
    WrapperComponent,
    CartComponent,
    AuthorizationComponent,
    RegistrationComponent,
    FastWaterComponent,
    ToolbarComponent,
    DegustationModalComponent,
    ErrorOrderComponent,
    ShareModalComponent,
    
  ],
  exports: [
    ShareModalComponent
  ],
  providers: [FooterService, SidebarDataService, FastWatherService, DegustationService, ShareService]
})
export class LayoutsModule { }
