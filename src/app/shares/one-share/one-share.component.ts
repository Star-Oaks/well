import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { SharesService } from '../shares.service';
import { MetaService } from '@ngx-meta/core';
import { OneShare } from '../../shared/model/shares/one-share';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

const breadgrams = {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "",
    "item": ""
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "",
    "item": ""
  }, {
    "@type": "ListItem",
    "position": 3,
    "name": "",
    "item": ""
  }]
}

@Component({
  selector: 'app-one-share',
  templateUrl: './one-share.component.html',
  styleUrls: ['./one-share.component.scss']
})
export class OneShareComponent implements OnInit {
  public data: OneShare;
  public seoText: string;
  private routeName: string;
  public symbolsAllowed: number = 23;
  public schemaBreadgrams = breadgrams;

  private translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private sharesService: SharesService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService,
    private sidebarService: SidebarService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    let request = this.activatedRoute.snapshot.data['sharesItem'];
    this.data = request as OneShare;
    this.routeName = this.data.urlName;
    this.completeSeoScript();
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
  quickOpen(key: string) {
    this.sidebarService.openModal(key);
  }
  completeSeoScript() {
    const urlTree = this.router.parseUrl(this.router.url);
    const uri = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    this.schemaBreadgrams = undefined;
    setTimeout(() => {
      this.schemaBreadgrams = breadgrams;
      this.schemaBreadgrams.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schemaBreadgrams.itemListElement[0].item = environment.host;
      this.schemaBreadgrams.itemListElement[1].name = this.translateCore.instant("shares.name");
      this.schemaBreadgrams.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/akcii" 
      this.schemaBreadgrams.itemListElement[2].name = this.data.header;
      this.schemaBreadgrams.itemListElement[2].item = environment.host + "/" + uri;
    })

  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        let shareSub: Subscription = this.sharesService.getOneShare(this.routeName).subscribe(
          res => {
            this.data = res as OneShare;
            this.completeSeoScript();
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
            if (shareSub) {
              shareSub.unsubscribe();
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
