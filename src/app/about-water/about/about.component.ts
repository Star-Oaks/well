import { Component, OnInit, ViewChild } from '@angular/core';
import { Water } from '../../shared/model/water-page/water';
import { Subscription } from 'rxjs';
import Player from '@vimeo/player';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { WaterService } from './water.service';
import { MetaService } from '@ngx-meta/core';
import { WaterSliderItem } from '../../shared/model/water-page/water-slider-item';
import { WaterTabItem } from '../../shared/model/water-page/water-tab-item';
import { BrowserService } from '../../shared/services/browser.service';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public data: Water;
  public isBrowser: boolean;
  public windowWidth: number;
  public seoText: string;
  public slides: WaterSliderItem[] = [];
  public tabs: WaterTabItem[] = [];
  public symbolsAllowed: number;
  public n: number = 0.98;
  public player: any;
  public videoPaused: boolean = true;
  public schema = Schema;
  public slideConfig = {
    mobileFirst: true,
    swipe: true,
    "slidesToShow": 1,
    "slidesToScroll": 1,
    arrows: true,
    dots: false,
    prevArrow: '<a class="slick-prev slick-arrow" aria-label="Prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="vdlna" d="M26.552 1254.468v-.94h18.454v.94zm-.162-3.46v5.98l-3.4-2.991z"/></defs><g><g transform="translate(-23 -1251)"><use xlink:href="#vdlna"/></g></g></svg></a>',
    nextArrow: '<a class="slick-next slick-arrow" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="cacma" d="M721.994 1254.468v-.94h18.454v.94zm22.016-.471l-3.4 2.99v-5.978z"/></defs><g><g  transform="translate(-722 -1251)"><use xlink:href="#cacma"/></g></g></svg></a>',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          swipe: true,
          slidesToScroll: 1,
          arrows: true,
          dots: false
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
        }
      }
    ]
  };

  public translateSubscription: Subscription;

  @ViewChild('player_container', { static: false }) playerContainer;
  @ViewChild('player_grad', { static: false }) playerGrad;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private waterService: WaterService,
    private browserService: BrowserService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private translateCore: TranslateService

  ) {
    this.isBrowser = this.browserService.getPlatform();
    let request = this.activatedRoute.snapshot.data['water'];
    this.data = request as Water;
    this.completeSeoScript();
    if (this.data.aboutWaterPageTabs) {
      this.tabs = this.data.aboutWaterPageTabs;
      this.tabs = this.tabs.sort((a, b) => (a.numberInSequence > b.numberInSequence) ? 1 : -1);
    }
    if (this.data.aboutWaterSliderItems) {
      this.slides = this.data.aboutWaterSliderItems;
    }
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
    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();
      if (this.windowWidth < 768) {
        this.symbolsAllowed = this.windowWidth / this.n;
        return;
      }
      if (this.windowWidth >= 768 && this.windowWidth < 1200) {
        this.symbolsAllowed = this.windowWidth / this.n / 2.1;
        return;
      }
      if (this.windowWidth >= 1200 && this.windowWidth < 1440) {
        this.symbolsAllowed = this.windowWidth / this.n / 3.8;
      }
      if (this.windowWidth >= 1440 && this.windowWidth < 1600) {
        this.symbolsAllowed = this.windowWidth / this.n / 4;
      }
      if (this.windowWidth >= 1600) {
        this.symbolsAllowed = this.windowWidth / this.n / 5.2;
      }
    }
  }
  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");;
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("water.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/o-vode";
      
    })

  }

  playVideo() {
    if (this.videoPaused) {
      this.player.play();
      this.videoPaused = false;
    }
    else {
      this.player.pause();
      this.videoPaused = true;
    }
  }
  slickInit(event) {
    if (event.slick.slideWidth == 0) {
      setTimeout(
        () => {
          this.refresh(event);
        }, 100);
    }
  }
  refresh(event) {
    event.slick.refresh();
  }
  afterChange(event) {
    if (event.slick.slideWidth == 0) {
      setTimeout(
        () => {
          this.refresh(event);
        }
        , 100);
    }
  }

  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
       
        let waterSub: Subscription = this.waterService.getWaterData().subscribe(
          res => {
            this.data = res as Water;
            this.completeSeoScript();
            if (this.data.aboutWaterPageTabs) {
              this.tabs = this.data.aboutWaterPageTabs;
              this.tabs = this.tabs.sort((a, b) => (a.numberInSequence > b.numberInSequence) ? 1 : -1);
            }
            if (this.data.aboutWaterSliderItems) {
              this.slides = this.data.aboutWaterSliderItems;
            }
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
            if (waterSub) {
              waterSub.unsubscribe();
            }
          }
        )
      }
    )
    
  }
  ngAfterViewInit() {
    if (this.isBrowser) {
      this.player = new Player(this.playerContainer.nativeElement, {
        id: this.data.videoUrl,
        width: 940,
        height: 529,
        responsive: true,
      });
      this.player.on('pause', () => {
        this.videoPaused = true;
      })
    }
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

}
