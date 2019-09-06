import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitemapRoutingModule } from './sitemap-routing.module';
import { SitemapComponent } from './sitemap.component';
import { SitemapResolveService } from './sitemap.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { GlobalsModule } from '../shared/globals/globals.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SitemapComponent],
  imports: [
    CommonModule,
    SitemapRoutingModule,
    LocalizeRouterModule,
    GlobalsModule,
    TranslateModule
  ],
  providers: [
    SitemapResolveService
  ]
})
export class SitemapModule { }
