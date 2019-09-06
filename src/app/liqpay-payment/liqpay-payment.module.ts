import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { LiqpayPaymentRoutes } from './liqpay-payment.routing.module';

@NgModule({
  declarations: [SuccessComponent, ErrorComponent],
  imports: [
    CommonModule,
    LiqpayPaymentRoutes,
    LocalizeRouterModule,
    TranslateModule,
  ]
})
export class LiqpayPaymentModule { }
