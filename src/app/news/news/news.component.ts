import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserService } from '../../shared/services/browser.service';
import { TranslatesService } from '../../shared/translates';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from './news.service';
import { Subscription, forkJoin } from 'rxjs';
import { MetaService } from '@ngx-meta/core';
import { NewsItem } from '../../shared/model/news/news-item';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit {

  public data: Object;
  public seoText: string;
  public newsBlock: NewsItem[];
  public nothingToLoad: boolean = false;
  public lastDateShown: string;
  public isBrowser: boolean;
  public windowWidth: number;
  public headerSymbolsAllowed: number = 80;
  public subheaderSymbolsAllowed: number = 70;
  public n: number = 3.3;
  public schema = Schema
  public translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private newsService: NewsService,
    private browserService: BrowserService,
    private readonly meta: MetaService,
    private linkService: LinkService,
    private router: Router,
    private gtag: Gtag
  ) {
    this.isBrowser = this.browserService.getPlatform();
    let request = this.activatedRoute.snapshot.data['news'];
    this.data = request as Object;
    this.completeSeoScript();
    
    if (this.data[0]) {
      this.newsBlock = this.data[0].item1;
      this.nothingToLoad = this.data[0].item2;
      this.lastDateShown = this.newsBlock[this.newsBlock.length - 1].publishDate;
    }

    if (this.data[1]) {
      this.meta.setTitle(`${this.data[1].seoTag.title}`);
      this.meta.setTag('description', this.data[1].seoTag.description);
      this.linkService.addTag({ rel: 'canonical', href: this.router.url })
      this.seoText = this.data[1].seoTag.text;
      if (this.browserService.isBrowser) {
        this.gtag.pageview({
          page_title: this.data[1].seoTag.title,
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
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");;
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("news.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/novosti";
      
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
        let lastNewsRequest = this.newsService.getLastNews();
        let newsSeoRequest = this.newsService.getNewsSeo();

        let newsSubs: Subscription = forkJoin([lastNewsRequest, newsSeoRequest]).subscribe(
          res => {
            this.data = res as Object;
            this.completeSeoScript();
            if (this.data[0]) {
              this.newsBlock = this.data[0].item1;
              this.nothingToLoad = this.data[0].item2;
              this.lastDateShown = this.newsBlock[this.newsBlock.length - 1].publishDate;
            }
            if (this.data[1].seoTag) {
              this.meta.setTitle(`${this.data[1].seoTag.title}`);
              this.meta.setTag('description', this.data[1].seoTag.description);
              this.seoText = this.data[1].seoTag.text;
              if (this.browserService.isBrowser) {
                this.gtag.pageview({
                  page_title: this.data[1].seoTag.title,
                  page_path: this.router.url,
                  page_location: environment.api + this.router.url
                });
              }
            }
            if (newsSubs) {
              newsSubs.unsubscribe();
            }
          }
        )
      }
    );
  }

  loadMoreNews() {
    let newsSub: Subscription = this.newsService.getLastNews(this.lastDateShown).subscribe(
      (res: { item1: NewsItem[], item2: boolean }) => {
        let newsToAdd = res;
        this.newsBlock = this.newsBlock.concat(newsToAdd.item1);
        this.nothingToLoad = newsToAdd.item2;
        this.lastDateShown = this.newsBlock[this.newsBlock.length - 1].publishDate;
        if (newsSub) {
          newsSub.unsubscribe();
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
