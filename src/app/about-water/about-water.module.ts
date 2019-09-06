import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-tabset';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GlobalsModule } from '../shared/globals/globals.module';
import { WaterService, WaterResolveService } from './about/water.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxJsonLdModule } from 'ngx-json-ld';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    GlobalsModule,
    TabsModule,
    SlickCarouselModule,
    LocalizeRouterModule,
    TranslateModule,
    GlobalsModule,
    NgxJsonLdModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutComponent,
        resolve: {
          water: WaterResolveService
        }
      }
    ])
  ],
  providers: [WaterService, WaterResolveService]
})
export class AboutWaterModule { }
