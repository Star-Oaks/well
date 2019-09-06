import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorsicoComponent } from './corsico/corsico.component';
import { JacobsComponent } from './jacobs/jacobs.component';
import { DegustationComponent } from './degustation/degustation.component';
import { CoffeeRoutes } from './coffee-routing.module';
import { CoffeeComponent } from './coffee.component';
import { GlobalsModule } from '../shared/globals/globals.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CorsicoService, CorsicoResolveService } from './corsico/corsico.service';
import { TranslateModule } from '@ngx-translate/core';
import { JacobsResolceService, JacobsService } from './jacobs/jacobs.service';
import { DegustationResolveService, DegustationService } from './degustation/degustation.service';
import { GtagModule } from 'angular-gtag';
import { NgxJsonLdModule } from 'ngx-json-ld';


@NgModule({
  declarations: [CoffeeComponent, CorsicoComponent, JacobsComponent, DegustationComponent],
  imports: [
    CommonModule,
    CoffeeRoutes,
    LocalizeRouterModule,
    TranslateModule,
    GlobalsModule,
    NgxSmartModalModule.forChild(),
    ReactiveFormsModule,
    GtagModule,
    NgxJsonLdModule
  ],
  providers: [CorsicoService, CorsicoResolveService,
    JacobsResolceService, JacobsService,
    DegustationService, DegustationResolveService]
})
export class CoffeeModule { }
