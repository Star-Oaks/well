import { Component, OnInit } from '@angular/core';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TranslatesService } from '../../shared/translates';
import { Gtag } from 'angular-gtag';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';

@Component({
  selector: 'app-after-payment',
  templateUrl: './after-payment.component.html',
  styleUrls: ['./after-payment.component.scss']
})
export class AfterPaymentComponent implements OnInit {

  public paymentSuccess: boolean = true;
  public paymentStatusUrl: string = "";

  private translateSubscription: Subscription;
  constructor(
    private readonly meta: MetaService,
    private translateCoreService: TranslateService,
    private translateService: TranslatesService,
    private gtag: Gtag,
    private router: Router,
    private browserService: BrowserService
  ) {
    let title = this.translateCoreService.instant('after-payment.successPayment');
    this.meta.setTitle(title);
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: title,
        page_path: this.router.url,
        page_location: environment.api + this.router.url
      });
    }
  }
  ngOnInit() {
    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        let title = this.translateCoreService.instant('after-payment.successPayment');
        this.meta.setTitle(title);
        if (this.browserService.isBrowser) {
          this.gtag.pageview({
            page_title: title,
            page_path: this.router.url,
            page_location: environment.api + this.router.url
          });
        }
      }
    )
    if (this.paymentSuccess) {
      this.paymentStatusUrl = "assets/img/icons/success.svg";
    }
    else {
      this.paymentStatusUrl = "assets/img/icons/error.svg";
    }
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
