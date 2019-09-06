import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FranchisingComponent } from './franchising/franchising.component';
import { RouterModule } from '@angular/router';
import { GlobalsModule } from '../shared/globals/globals.module';
import { FranchisingService, FranchisingResolveService } from './franchising/franchising.service';
import { LocalizeRouterModule } from '../shared/localize/localize-router.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxJsonLdModule } from 'ngx-json-ld';

@NgModule({ 
  declarations: [FranchisingComponent],
  imports: [
    CommonModule,
    GlobalsModule,
    LocalizeRouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgxJsonLdModule,
    RouterModule.forChild([
      {
        path: '',
        component: FranchisingComponent,
        resolve: {
          res : FranchisingResolveService
        }
      }
    ])
  ],
  providers: [FranchisingService, FranchisingResolveService]
})
export class FranchisingModule { }
