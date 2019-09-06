import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharesComponent } from './shares/shares.component';
import { OneShareComponent } from './one-share/one-share.component';
import { NotTypicalShareComponent } from './not-typical-share/not-typical-share.component';
import { SharesRoutes } from './shares-routing.module';
import { GlobalsModule } from '../shared/globals/globals.module';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharesService, SharesResolveService, NotTypicalShareResolveService, SharesItemResolveService } from './shares.service';
import { TranslateModule } from '@ngx-translate/core';
import { GtagModule } from 'angular-gtag';
import { NgxJsonLdModule } from 'ngx-json-ld';
import { LayoutsModule } from '../shared/layouts/layouts.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [SharesComponent, OneShareComponent, NotTypicalShareComponent],
  imports: [
    CommonModule,
    GlobalsModule,
    SharesRoutes,
    ReactiveFormsModule,
    FormsModule,
    LocalizeRouterModule,
    TranslateModule,
    GtagModule,
    NgxJsonLdModule,
    LayoutsModule,
    // NgxSmartModalModule.forChild()
  ],
  providers: [SharesService, SharesResolveService, SharesItemResolveService, NotTypicalShareResolveService]
  
})
export class SharesModule { }
