import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatesService } from '../../shared/translates';
import { CartService } from '../../shared/services/cart.service';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  public paymentStatusUrl: string = "";

  private translateSubscription: Subscription;
  constructor(
    private readonly meta: MetaService,
    private translateCoreService: TranslateService,
    private translateService: TranslatesService,
    private cartService: CartService,
    private linkService: LinkService,
    private gtag: Gtag,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.linkService.addTag({ rel: 'canonical', href: '/payment/error' })
    let title = this.translateCoreService.instant('after-payment.successPayment');
    this.meta.setTitle(title);
    this.gtag.pageview({
      page_title: title,
      page_path: this.router.url,
      page_location: environment.api + this.router.url
    });
  }
  ngOnInit() {
    this.cartService.clearProducts();
    this.localStorage.setData("payment", 1);
    setTimeout(()=>this.localStorage.clearData("payment"), 1000);
    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        let title = this.translateCoreService.instant('after-payment.successPayment');
        this.meta.setTitle(title);
        this.gtag.pageview({
          page_title: title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    )

    this.paymentStatusUrl = "assets/img/icons/success.svg";

  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

}
