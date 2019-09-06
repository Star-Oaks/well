import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatesService } from '../../shared/translates';
import { LinkService } from '../../shared/services/link.service';
import { CartService } from '../../shared/services/cart.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/server/environment';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public paymentStatusUrl: string = "";

  private translateSubscription: Subscription;
  constructor(
    private readonly meta: MetaService,
    private translateCoreService: TranslateService,
    private translateService: TranslatesService,
    private linkService: LinkService,
    private cartService: CartService,
    private router: Router,
    private sidebarService: SidebarService,
    private gtag: Gtag,
    private localStorage: LocalStorageService
  ) {
    this.linkService.addTag({ rel: 'canonical', href: '/payment/error' })
    let title = this.translateCoreService.instant('after-payment.errorPayment');
    this.meta.setTitle(title);
    this.gtag.pageview({
      page_title: title,
      page_path: this.router.url,
      page_location: environment.api + this.router.url
    });
  }
  ngOnInit() {
    this.localStorage.setData("payment", 2);
    setTimeout(()=>this.localStorage.clearData("payment"), 1000);
    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        let title = this.translateCoreService.instant('after-payment.errorPayment');
        this.meta.setTitle(title);
        this.gtag.pageview({
          page_title: title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    )
    this.paymentStatusUrl = "assets/img/icons/error.svg";
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
  tryAgain() {
    if (this.cartService.products.length) {
      this.router.navigate(['/', this.translateService.getCurrentLang(), 'cart'])
    }
    else {
      this.sidebarService.openCart();
    }
  }
}
