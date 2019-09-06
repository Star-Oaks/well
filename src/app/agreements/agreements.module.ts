import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementsRoutingModule } from './agreements-routing.module';
import { GlobalsModule } from '../shared/globals/globals.module';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { PublicSalesContractComponent } from './public-sales-contract/public-sales-contract.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { AgreementsService, PublicContractResolveService, UserAgreementResolveService } from './agreements.service';


@NgModule({
  declarations: [PublicSalesContractComponent, UserAgreementComponent],
  imports: [
    CommonModule,
    AgreementsRoutingModule,
    LocalizeRouterModule,
    TranslateModule,
    GlobalsModule,
  ],
  providers: [AgreementsService, PublicContractResolveService, UserAgreementResolveService]
})
export class AgreementsModule { }
