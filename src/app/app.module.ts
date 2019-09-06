// angular
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule, DefaultUrlSerializer, UrlTree, UrlSerializer, PreloadAllModules, Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// libs
import { CookieService, CookieModule } from 'ngx-cookie';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { GtagModule } from 'angular-gtag';
import { NgxJsonLdModule } from 'ngx-json-ld';

// components

import { AppComponent } from './app.component';
// shared
import { TranslatesService } from './shared/translates';
import { SharedModule } from './shared/shared.module';
import { UniversalStorage } from './shared/storage/universal.storage';
import { DropdownModule } from 'ngx-dropdown';
import { SidebarModule } from 'ng-sidebar';
import { TabsModule } from 'ngx-tabset';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AppRoutes } from './app-routing.module';
import { LocalizeRouterModule } from './shared/localize/localize-router.module';
import { AppHttpInterceptor } from './app.config.service';

import { NotFoundService } from './not-found/not-found.service';
import { InlineSVGModule } from 'ng-inline-svg';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  constructor(
    private notFound: NotFoundService
  ) {
    super();
  }
  parse(url: string): UrlTree {
    if (this.hasUpperCase(url)) {
      // this.notFound.setStatus(301);
      return super.parse(url.toLowerCase());
    }
    else return super.parse(url);
  }
  hasUpperCase(str) {
    return str.toLowerCase() != str;
  }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutes,
    LocalizeRouterModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
    DropdownModule,
    SidebarModule.forRoot(),
    TabsModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    InlineSVGModule.forRoot(),
    GtagModule.forRoot({ trackingId: 'UA-139030497-1', trackPageviews: false, debug: false }),
    NgxJsonLdModule
  ],
  declarations: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    CookieService,
    UniversalStorage,
    NotFoundService,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer, deps: [NotFoundService] },
    { provide: APP_INITIALIZER, useFactory: initLanguage, multi: true, deps: [TranslatesService] }
  ],
})
export class AppModule { }
