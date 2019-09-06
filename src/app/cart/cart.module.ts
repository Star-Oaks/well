import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { GlobalsModule } from '../shared/globals/globals.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RecommendationsListComponent } from './recommendations-list/recommendations-list.component';
import { RecommendationsItemComponent } from './recommendations-item/recommendations-item.component';
import { PromotionsListComponent } from './promotions-list/promotions-list.component';
import { PromotionsItemComponent } from './promotions-item/promotions-item.component';
import { CART_ROUTES } from './cart-routing.module';
import { OrderingComponent } from './ordering/ordering.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderingResolveService } from './ordering/ordering.resolve.service';
import { CartResolveService } from './cart/cart.resolve.service';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AfterPaymentComponent } from './after-payment/after-payment.component';
import { DirectivesModule } from '../shared/directives/directives.module';

@NgModule({
  declarations: [CartComponent, OrderComponent, RecommendationsComponent, PromotionsComponent, RecommendationsListComponent, RecommendationsItemComponent, PromotionsListComponent, PromotionsItemComponent, OrderingComponent, AfterPaymentComponent],
  imports: [
    CommonModule,
    GlobalsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    LocalizeRouterModule,
    TranslateModule,
    NgSelectModule,
    NgxMyDatePickerModule.forRoot(),
    NgxSmartModalModule,
    CART_ROUTES,
    DirectivesModule
  ],
  providers: [OrderingResolveService, CartResolveService]
})
export class CartModule { }
