import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsComponent } from './points/points.component';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { GlobalsModule } from '../shared/globals/globals.module';
import { PointsResolveService, PointsService } from './points/points.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxJsonLdModule } from 'ngx-json-ld';
@NgModule({
  declarations: [PointsComponent],
  imports: [
    CommonModule,
    LocalizeRouterModule,
    TranslateModule,
    GlobalsModule,
    NgxJsonLdModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyBL4Bi6h2DIcOJx-XHEOoHKFSx8wQ19JsE',
    }),
    GlobalsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PointsComponent,
        resolve: {
          res : PointsResolveService
        }
      }

    ])
  ],
  providers:[PointsResolveService ,PointsService]
})
export class ExchangePointModule { }
