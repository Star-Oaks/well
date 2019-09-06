import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurClientsComponent } from './our-clients/our-clients.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { DeliveryWaterComponent } from './delivery-water/delivery-water.component';
import { TextEllipsisComponent } from './text-ellipsis/text-ellipsis.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReadMoreDirective } from './directives/read-more.directive';
import { CounterInputComponent } from './counter/counter.component';
import { HtmlSanitizerPipe } from '../pipes/sanitize';
import { TranslateModule } from '@ngx-translate/core';
import { OurClientsService } from './our-clients/our-clients.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SubscribeService } from './subscribe/subscribe.service';
import { SafeTextEllipsisComponent } from './text-ellipsis/safe-text-ellipsis.component';
import { ShortHeaderTextComponent } from './text-ellipsis/short-header-text.component';
import { GtagModule } from 'angular-gtag';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PopularRequestComponent } from './popular-request/popular-request.component';
import { LocalizeRouterModule } from '../localize/localize-router.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OurClientsComponent,
    SubscribeComponent,
    DeliveryWaterComponent,
    TextEllipsisComponent,
    SafeTextEllipsisComponent,
    ShortHeaderTextComponent,
    ReadMoreDirective,
    CounterInputComponent,
    HtmlSanitizerPipe,
    PopularRequestComponent,
  ],
  imports: [
    CommonModule,
    SlickCarouselModule,
    TranslateModule,
    ReactiveFormsModule,
    GtagModule,
    LazyLoadImageModule,
    LocalizeRouterModule,
    RouterModule
  ],
  exports: [
    TextEllipsisComponent,
    SafeTextEllipsisComponent,
    ShortHeaderTextComponent,
    OurClientsComponent,
    SubscribeComponent,
    DeliveryWaterComponent,
    CounterInputComponent,
    PopularRequestComponent,
    ReadMoreDirective,
    HtmlSanitizerPipe,
  ],
  providers: [OurClientsService, SubscribeService]
})
export class GlobalsModule { }
