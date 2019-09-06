import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MetaService } from '@ngx-meta/core';
import { BrowserService } from '../shared/services/browser.service';
import { TranslatesService } from '../shared/translates';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderModel } from '../shared/model/home/header.model';
import { BestDeals } from '../shared/model/home/best-dials.model';
import { Subscription, forkJoin } from 'rxjs';
import { HomeService } from './home.service';
import { Phone } from '../shared/model/contacts/phone';
import { LinkService } from '../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public dataHome: HeaderModel;
  public dataHomeBest: Array<BestDeals>;
  public windowWidth: number;
  public seoText: string;
  public phone: Phone;

  public show: boolean = false;
  public data: HeaderModel;
  public isBrowser: boolean = false;

  private translateSubscription: Subscription;

  constructor(
    private readonly meta: MetaService,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private browserService: BrowserService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag
  ) {
    let request = this.activatedRoute.snapshot.data['res'];
    this.data = request as HeaderModel;
    this.isBrowser = this.browserService.getPlatform();
    this.dataHome = this.data[0];
    this.dataHomeBest = <Array<BestDeals>>this.data[1].sort((a, b) => a.numberInSequence - b.numberInSequence).sort((a, b) => b.minOrderCount - a.minOrderCount);
    let phones = this.data[2] as Phone[];
    if (phones && phones.length) {
      this.phone = phones.sort((a, b) => a.numberInSequence - b.numberInSequence).reduce(x => x);
    }
    if (this.dataHome.seoTag) {
      this.meta.setTitle(this.dataHome.seoTag.title);
      this.meta.setTag('description', this.dataHome.seoTag.description);
      this.linkService.addTag({ rel: 'canonical', href: this.router.url })
      this.seoText = this.dataHome.seoTag.text;
      if (this.browserService.isBrowser) {
        this.gtag.pageview({
          page_title: this.dataHome.seoTag.title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    }

    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();
      if (this.windowWidth > 1199) {
        this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.bigImageUrl;

        this.dataHome.mainPageSliderItems.forEach((element) => {
          element.bannerImageUrl = element.bigImageUrl;
        });
        this.dataHomeBest.forEach((element) => {
          element.productPhotos.bannerImageUrl = element.productPhotos.smallImageUrl;
        });
        this.dataHomeBest = this.dataHomeBest.slice(0, 6);
      }
      else {
        this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.smallImageUrl;
        this.dataHome.mainPageSliderItems.forEach((element) => {
          element.bannerImageUrl = element.smallImageUrl;
        });
        this.dataHomeBest.forEach((element) => {
          element.productPhotos.bannerImageUrl = element.productPhotos.thumbnailImageUrl;
        });
        this.dataHomeBest = this.dataHomeBest.slice(0, 4);
      }
    }
    else {
      this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.smallImageUrl;

      this.dataHome.mainPageSliderItems.forEach((element) => {
        element.bannerImageUrl = element.smallImageUrl;
      });

      this.dataHomeBest.forEach((element) => {
        element.productPhotos.bannerImageUrl = element.productPhotos.thumbnailImageUrl;
      });
      this.dataHomeBest = this.dataHomeBest.slice(0, 6);
    }
  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(() => {
      let homeDataRequest = this.homeService.getHomeData();
      let homeBestdealsRequest = this.homeService.getBestdealsData();
      let dataSub: Subscription = forkJoin([homeDataRequest, homeBestdealsRequest]).subscribe(
        (response) => {
          this.dataHome = response[0] as HeaderModel;
          this.dataHomeBest = response[1] as Array<BestDeals>;
          this.dataHomeBest.sort((a, b) => a.numberInSequence - b.numberInSequence);
          if (this.dataHome.seoTag) {
            this.meta.setTitle(`${this.dataHome.seoTag.title}`);
            this.meta.setTag('description', this.dataHome.seoTag.description);
            this.seoText = this.dataHome.seoTag.text;
            if (this.browserService.isBrowser) {
              this.gtag.pageview({
                page_title: this.dataHome.seoTag.title,
                page_path: this.router.url,
                page_location: environment.api + this.router.url
              });
            }
          }
          if (this.isBrowser) {
            this.windowWidth = this.browserService.getViewPortWidth();
            if (this.windowWidth > 767) {
              this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.bigImageUrl;

              this.dataHome.mainPageSliderItems.forEach((element) => {
                element.bannerImageUrl = element.bigImageUrl;
              });
              this.dataHomeBest.forEach((element) => {
                element.productPhotos.bannerImageUrl = element.productPhotos.smallImageUrl;
              });
              this.dataHomeBest = this.dataHomeBest.slice(0, 6);
            }
            else {
              this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.smallImageUrl;
              this.dataHome.mainPageSliderItems.forEach((element) => {
                element.bannerImageUrl = element.smallImageUrl;
              });

              this.dataHomeBest.forEach((element) => {
                element.productPhotos.bannerImageUrl = element.productPhotos.smallImageUrl;
              });
              this.dataHomeBest = this.dataHomeBest.slice(0, 4);
            }
          }
          else {
            this.dataHome.mainPageBannerItem.bannerImageUrl = this.dataHome.mainPageBannerItem.smallImageUrl;
            this.dataHome.mainPageSliderItems.forEach((element) => {
              element.bannerImageUrl = element.smallImageUrl;
            });
            this.dataHomeBest.forEach((element) => {
              element.productPhotos.bannerImageUrl = element.productPhotos.smallImageUrl;
            });
            this.dataHomeBest = this.dataHomeBest.slice(0, 6);
          }
          if (dataSub) {
            dataSub.unsubscribe()
          }
        },
        () => {
          if (dataSub) {
            dataSub.unsubscribe();
          }
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
