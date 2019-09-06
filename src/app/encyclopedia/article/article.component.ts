import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';
import { Article } from '../../shared/model/encyclopedia/article';
import { Subscription } from 'rxjs';
import { EncyclopediaService } from '../encyclopedia.service';
import { MetaService } from '@ngx-meta/core';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public data: Article;
  public seoText: string;
  private routeName: string;
  public symbolsAllowed: number = 23;

  private translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private encyclopediaService: EncyclopediaService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {
    let request = this.activatedRoute.snapshot.data['article'];
    this.data = request as Article;
    this.routeName = this.data.urlName;
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
        let articleSub: Subscription = this.encyclopediaService.getArticle(this.routeName).subscribe(
          res => {
            this.data = res as Article;
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
            if (articleSub) {
              articleSub.unsubscribe();
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
