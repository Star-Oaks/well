import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { HomeRoutes } from './home.routing';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { BestDealsComponent } from './best-deals/best-deals.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../shared/shared.module';
import { GlobalsModule } from '../shared/globals/globals.module';
 import { HomeService, HomeResolveService } from './home.service';
import { EncyclopediaService } from '../encyclopedia/encyclopedia.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { GtagModule } from 'angular-gtag';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DirectivesModule } from '../shared/directives/directives.module';

@NgModule({
  imports: [
    CommonModule, 
    HomeRoutes, 
    TranslateModule, 
    SlickCarouselModule,
    GlobalsModule,
    LocalizeRouterModule,
    GtagModule,
    LazyLoadImageModule,
    DirectivesModule
  ],
  declarations: [HomeComponent, HeaderComponent, SliderComponent, BestDealsComponent],
   providers:[HomeService, HomeResolveService,EncyclopediaService]
})
export class HomeModule {}
