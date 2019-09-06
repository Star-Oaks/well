import { Component, OnInit } from '@angular/core';
import { UserAgreement } from '../../shared/model/agreements/user-agreement';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { AgreementsService } from '../agreements.service';
import { MetaService } from '@ngx-meta/core';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent implements OnInit {

  public data: UserAgreement;
  public seoText: string;
  public translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private agreementsService: AgreementsService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {
    let request = this.activatedRoute.snapshot.data['userAgreement'];
    this.data = request as UserAgreement;
    if (this.data.seoTag) {
      this.meta.setTitle(`${this.data.seoTag.title}`);
      this.meta.setTag('description', this.data.seoTag.description);
      this.linkService.addTag({ rel: 'canonical', href: this.router.url })
      this.seoText = this.data.seoTag.text;
      if (this.browserService.isBrowser) {
        this.gtag.pageview({
          page_title: this.data.seoTag.title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    }
  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        let agreementSub: Subscription = this.agreementsService.getUserAgreement().subscribe(
          res => {
            this.data = res as UserAgreement;
            if (this.data.seoTag) {
              this.meta.setTitle(`${this.data.seoTag.title}`);
              this.meta.setTag('description', this.data.seoTag.description);
              this.seoText = this.data.seoTag.text;
              if (this.browserService.isBrowser) {
                this.gtag.pageview({
                  page_title: this.data.seoTag.title,
                  page_path: this.router.url,
                  page_location: environment.api + this.router.url
                });
              }
            }
            if (agreementSub) {
              agreementSub.unsubscribe();
            }
          }
        )
      }
    )
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

}
