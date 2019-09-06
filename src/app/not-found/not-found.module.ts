import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalsModule } from '../shared/globals/globals.module';
import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutes } from './not-found.routing';
import { NotFoundService } from './not-found.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';

@NgModule({
  imports: [
    CommonModule, 
    NotFoundRoutes, 
    TranslateModule,
    LocalizeRouterModule,
    GlobalsModule
  ],
  providers: [NotFoundService],
  declarations: [NotFoundComponent],
})
export class NotFoundModule {}
