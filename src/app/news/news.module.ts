import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news/news.component';
import { OneNewsComponent } from './one-news/one-news.component';
import { NewsRoutes } from './news-routing.module';
import { GlobalsModule } from '../shared/globals/globals.module';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { NewsService, NewsResolveService, NewsItemResolveService } from './news/news.service';
import { NgxJsonLdModule } from 'ngx-json-ld';


@NgModule({
  declarations: [NewsComponent, OneNewsComponent],
  imports: [
    CommonModule,
    NewsRoutes,
    GlobalsModule,
    LocalizeRouterModule,
    TranslateModule,
    NgxJsonLdModule
  ],
  providers: [NewsService, NewsResolveService, NewsItemResolveService]
  
})
export class NewsModule { }
