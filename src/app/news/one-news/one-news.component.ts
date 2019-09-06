import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { NewsService } from '../news/news.service';
import { MetaService } from '@ngx-meta/core';
import { Subscription } from 'rxjs';
import { NewsItem } from '../../shared/model/news/news-item';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/browser/environment';
import { BrowserService } from '../../shared/services/browser.service';
import { TranslateService } from '@ngx-translate/core';

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
  selector: 'app-one-news',
  templateUrl: './one-news.component.html',
  styleUrls: ['./one-news.component.scss']
})
export class OneNewsComponent implements OnInit {
  public data: NewsItem;
  public seoText: string;
  private routeName: string;
  public symbolsAllowed: number = 23;
  public schemaBreadgrams = breadgrams;

  public translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private newsService: NewsService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {

    let request = this.activatedRoute.snapshot.data['newsItem'];
    this.data = request as NewsItem;
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
  completeSeoScript() {
    const urlTree = this.router.parseUrl(this.router.url);
    const uri = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    this.schemaBreadgrams = undefined;
    setTimeout(() => {
      this.schemaBreadgrams = breadgrams;
      this.schemaBreadgrams.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schemaBreadgrams.itemListElement[0].item = environment.host;
      this.schemaBreadgrams.itemListElement[1].name = this.translateCore.instant("news.name");
      this.schemaBreadgrams.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/novosti" 
      this.schemaBreadgrams.itemListElement[2].name = this.data.header;
      this.schemaBreadgrams.itemListElement[2].item = environment.host + "/" + uri;
    })

  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        let newsSub: Subscription = this.newsService.getNewsItem(this.routeName).subscribe(
          res => {
            this.data = res as NewsItem;
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
            if (newsSub) {
              newsSub.unsubscribe();
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
