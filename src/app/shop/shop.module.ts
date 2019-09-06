import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shopRoutes } from './shop-routing.module';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { FiltersComponent } from './filters/filters.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DropdownModule } from 'ngx-dropdown';
import { ShopComponent } from './shop-component';
import { RouterModule } from '@angular/router';
import { GlobalsModule } from '../shared/globals/globals.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShopService, ShopResolveService } from './shop.service';
import { ProductItemModule } from '../product-item/product-item.module';
import { NgxJsonLdModule } from 'ngx-json-ld';

@NgModule({
  declarations: [ShopComponent, ShopPageComponent, FiltersComponent, ProductListComponent],
  imports: [
    CommonModule,
    shopRoutes,
    SlickCarouselModule,
    DropdownModule,
    GlobalsModule,
    LocalizeRouterModule,
    TranslateModule,
    ProductItemModule,
    NgxJsonLdModule
  ],
  providers: [ShopService, ShopResolveService]
})
export class ShopModule { }
