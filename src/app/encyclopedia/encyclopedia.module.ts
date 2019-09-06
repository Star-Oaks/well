import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncyclopediaComponent } from './encyclopedia/encyclopedia.component';
import { ArticleComponent } from './article/article.component';
import { EncyclopediaRoutes } from './encyclopedia-routing.module';
import { GlobalsModule } from '../shared/globals/globals.module';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { ArticleResolveService, EncyclopediaResolveService, EncyclopediaService } from './../encyclopedia/encyclopedia.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxJsonLdModule } from 'ngx-json-ld';

@NgModule({
  declarations: [EncyclopediaComponent, ArticleComponent],
  imports: [
    CommonModule,
    EncyclopediaRoutes,
    GlobalsModule,
    LocalizeRouterModule,
    TranslateModule,
    NgxJsonLdModule
    
  ],
  providers: [EncyclopediaService, EncyclopediaResolveService, ArticleResolveService]
})
export class EncyclopediaModule { }
