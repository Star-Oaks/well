import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OurAwardsComponent } from './our-awards/our-awards.component';
import { OurValuesComponent } from './our-values/our-values.component';
import { OurMembershipComponent } from './our-membership/our-membership.component';
import { OurActivityComponent } from './our-activity/our-activity.component';
import { GlobalsModule } from '../shared/globals/globals.module';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { AboutCompanyService, AboutCompanyResolveService } from './about-company.service';
import { NgxJsonLdModule } from 'ngx-json-ld';

@NgModule({
  declarations: [AboutComponent, OurAwardsComponent, OurValuesComponent, OurMembershipComponent, OurActivityComponent],
  imports: [
    CommonModule,
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
          res : AboutCompanyResolveService
        }
      }
    ])
  ],
  
  providers:[AboutCompanyResolveService ,AboutCompanyService]
})
export class AboutCompanyModule { }
