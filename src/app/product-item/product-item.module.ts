import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from './product-item/product-item.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { GtagModule } from 'angular-gtag';
import { GlobalsModule } from '../shared/globals/globals.module';
import { DirectivesModule } from '../shared/directives/directives.module';

@NgModule({
  declarations: [ProductItemComponent],
  imports: [
    CommonModule,
    SlickCarouselModule,
    LocalizeRouterModule,
    TranslateModule,
    RouterModule,
    GtagModule,
    GlobalsModule,
    DirectivesModule
  ],
  exports: [ProductItemComponent]
})
export class ProductItemModule { }
