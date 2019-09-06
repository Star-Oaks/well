import { Component, NgZone } from '@angular/core';

import { MetaService } from '@ngx-meta/core';
import { TranslatesService } from './shared/translates';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LocalizeRouterService } from './shared/localize/localize-router.service';
import { filter } from 'rxjs/operators';
import { LANG_LIST } from './shared/translates/translates.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { CartService } from './shared/services/cart.service';
import { Subscription } from 'rxjs';
import { BrowserService } from './shared/services/browser.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { ROUTE_COLLECTION_WITHOUT_LOCALE } from './shared/layouts/toolbar/collection-routes-without-locale';
import { NO_FOLLOW_LINKS } from './app-no-follow-links';

export let currentLangGlobal: string = "ua";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})

export class AppComponent {
  private locales: string[];
  private subs: Subscription = new Subscription();
  private isBrowser: boolean;
  constructor(
    private translate: TranslatesService,
    private localize: LocalizeRouterService,
    private router: Router,
    private cartService: CartService,
    private _browser: BrowserService,
    private localStorage: LocalStorageService,
    private actvitedRoute: ActivatedRoute,
    private meta: MetaService
  ) {
    this.isBrowser = this._browser.getPlatform();
  }
  ngOnInit() {
    if (this.isBrowser) {
      this.subs.add(fromEvent(window, 'storage')
        .subscribe((e: any) => {
          if (!e) { e = window.event; } // ie suq
          if (!e.newValue) return;          // do nothing if no value to work with
          if (e.key == 'products') {
            this.cartService.checkProducts()
          }
          if (e.key == "payment") {
            let value = this.localStorage.getData("payment");
            if (value) {
              this.cartService.eMoneyEvent.emit(value);
            }

          }
        })
      );
    }
    this.locales = LANG_LIST.map(x => x.code);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
      )
      .subscribe((event: NavigationStart) => {
        this.redirects(event.url)
      })
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.checkAdvertising(this.actvitedRoute.snapshot)
      })
  }
  checkAdvertising(snapshot: ActivatedRouteSnapshot) {
    let isAdvert = NO_FOLLOW_LINKS.some(x => snapshot.queryParamMap.has(x.toLowerCase()));
    if (isAdvert) {
      this.meta.setTag("robots", "noindex,nofollow");
    }
    else {
      this.meta.setTag("robots", "index, follow")
    }
  }
  redirects(url: string) {
    // console.log(url);
    const urlTree = this.router.parseUrl(url);
    const uri = urlTree.root.children['primary'] ? urlTree.root.children['primary'].segments.map(it => it.path) : ["/"];
    // const fragment = urlTree.fragment;
    const currentLang = this.translate.getCurrentLang();
    if (uri[0] === '/') {
      currentLangGlobal = LANG_LIST[1].code;
      this.translate.changeLang(LANG_LIST[1].code);
      this.localize.lastLang = LANG_LIST[1].code;
      return
    }
    if (uri.length > 0) {

      if (ROUTE_COLLECTION_WITHOUT_LOCALE.some(x => x === uri[0])) {
        return
      }
      if (uri[0] !== currentLang) {
        let isPage = false;
        this.locales.forEach(x => {
          if (uri[0] === x) {
            isPage = true;
            currentLangGlobal = x;
            this.translate.changeLang(uri[0]);
            this.localize.lastLang = uri[0];
            return
          }
        });

        if (!isPage) {
          this.router.navigate(['/', '404'])
          return;
        }
        return
      }
      else {
        currentLangGlobal = uri[0];
        this.translate.changeLang(uri[0]);
        this.localize.lastLang = uri[0];
      }
    }

    return false
  }
  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe()
    }
  }
}
