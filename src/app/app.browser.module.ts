// angular
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
// libs
import { REQUEST } from '@nguniversal/express-engine/tokens';
// shared

// components
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslatesBrowserModule } from './shared/translates/translates-browser';
import { InlineStyleComponent } from './inline-style/inline-style.component';
import { InlineStyleModule } from './inline-style/inline-style.module';
import { StateTransferInitializerModule, TransferHttpCacheModule } from '@nguniversal/common';
import { LazyLoadImageModule, intersectionObserverPreset, IsVisibleProps, SetErrorImageProps } from 'ng-lazyload-image';
// import { ServiceWorkerModule } from '@angular/service-worker';

// the Request object only lives on the server
export function getRequest(): any {
  return { headers: { cookie: document.cookie } };
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppModule,
    StateTransferInitializerModule,
    BrowserTransferStateModule,
    TranslatesBrowserModule,
    // InlineStyleModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false }),
    LazyLoadImageModule.forRoot ({
      preset: intersectionObserverPreset
    })
  ],
  providers: [
    {
      // The server provides these in main.server
      provide: REQUEST,
      useFactory: getRequest,
    },
    { provide: 'ORIGIN_URL', useValue: location.origin },
  ],
})
export class AppBrowserModule {}
