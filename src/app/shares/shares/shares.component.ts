import { Component, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { SharesPageItem } from '../../shared/model/shares/shares-page-item';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { SharesService } from '../shares.service';
import { BrowserService } from '../../shared/services/browser.service';
import { MetaService } from '@ngx-meta/core';
import { NotTypicalShare } from '../../shared/model/shares/not-typical-share';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {

  public data: Object;
  public notTypicalShare: NotTypicalShare;
  public seoText: string;
  public sharesBlock: SharesPageItem[] = [];
  public nothingToLoad: boolean = false;
  public lastDateShown: string;
  public isBrowser: boolean;
  public windowWidth: number;
  public translateSubscription: Subscription;
  public headerSymbolsAllowed: number = 80;
  public subheaderSymbolsAllowed: number = 70;
  public n: number = 3.3;
  public schema = Schema

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private sharesService: SharesService,
    private browserService: BrowserService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag
  ) {
    this.isBrowser = this.browserService.getPlatform();
    let request = this.activatedRoute.snapshot.data['shares'];
    this.data = request as Object;
    this.completeSeoScript();
    if (this.data[0]) {
      this.notTypicalShare = this.data[0];
    }
    if (this.data[1]) {
      this.sharesBlock = this.data[1].item1;
      this.nothingToLoad = this.data[1].item2;
      this.lastDateShown = this.sharesBlock[this.sharesBlock.length - 1].creationDate;
    }

    if (this.data[2]) {
      this.meta.setTitle(`${this.data[2].seoTag.title}`);
      this.meta.setTag('description', this.data[2].seoTag.description);
      this.linkService.addTag({ rel: 'canonical', href: this.router.url })
      this.seoText = this.data[2].seoTag.text;
      if (this.browserService.isBrowser) {
        this.gtag.pageview({
          page_title: this.data[2].seoTag.title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    }
  }
  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("shares.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/akcii";
      
    })

  }
  ngOnInit() {
    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();

      if (this.windowWidth < 768) {
        this.headerSymbolsAllowed = this.windowWidth / this.n;
        this.subheaderSymbolsAllowed = this.windowWidth / this.n / 1.2;
      }

      if (this.windowWidth >= 768 && this.windowWidth < 1200) {
        this.headerSymbolsAllowed = this.windowWidth / this.n / 2.8;
        this.subheaderSymbolsAllowed = this.windowWidth / this.n / 2.8;
      }

      if (this.windowWidth >= 1200 && this.windowWidth < 1440) {
        this.headerSymbolsAllowed = this.windowWidth / this.n / 5;
        this.subheaderSymbolsAllowed = this.windowWidth / this.n / 6;
      }

      if (this.windowWidth >= 1440 && this.windowWidth < 1600) {
        this.headerSymbolsAllowed = this.windowWidth / this.n / 5;
        this.subheaderSymbolsAllowed = this.windowWidth / this.n / 5.2;
      }

      if (this.windowWidth >= 1600) {
        this.headerSymbolsAllowed = this.windowWidth / this.n / 7;
        this.subheaderSymbolsAllowed = this.windowWidth / this.n / 7.2;
      }
    }

    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        let notTypicalShareRequest = this.sharesService.getNotTypicalShare();
        let lastSharesRequest = this.sharesService.getLastShares();
        let sharesSeoRequest = this.sharesService.getSharesSeo();
        let sharesSub: Subscription = forkJoin([notTypicalShareRequest, lastSharesRequest, sharesSeoRequest]).subscribe(
          res => {
            this.data = res as Object;
            this.completeSeoScript();
            if (this.data[0]) {
              this.notTypicalShare = this.data[0];
            }
            if (this.data[1]) {
              this.sharesBlock = this.data[1].item1;
              this.nothingToLoad = this.data[1].item2;
              this.lastDateShown = this.sharesBlock[this.sharesBlock.length - 1].creationDate;
            }
            if (this.data[2]) {
              this.meta.setTitle(`${this.data[2].seoTag.title}`);
              this.meta.setTag('description', this.data[2].seoTag.description);
              this.seoText = this.data[2].seoTag.text;
              if (this.browserService.isBrowser) {
                this.gtag.pageview({
                  page_title: this.data[2].seoTag.title,
                  page_path: this.router.url,
                  page_location: environment.api + this.router.url
                });
              }
            }
            if (sharesSub) {
              sharesSub.unsubscribe();
            }
          }
        )
      }
    );
  }


  loadMoreNews() {
    let sharesSub: Subscription = this.sharesService.getLastShares(this.lastDateShown, true).subscribe(
      (res: { item1: SharesPageItem[], item2: boolean }) => {
        let sharesToAdd = res;
        this.sharesBlock = this.sharesBlock.concat(sharesToAdd.item1);
        this.nothingToLoad = sharesToAdd.item2;
        this.lastDateShown = this.sharesBlock[this.sharesBlock.length - 1].creationDate;
        if (sharesSub) {
          sharesSub.unsubscribe();
        }
      }
    )
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

}
