import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';
import { BrowserService } from '../../shared/services/browser.service';
import { MetaService } from '@ngx-meta/core';
import { CorsicoService } from './corsico.service';
import { TranslatesService } from '../../shared/translates';
import { ActivatedRoute, Router } from '@angular/router';
import { Corsico } from '../../shared/model/corsico/corsico';
import { Subscription } from 'rxjs';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-corsico',
  templateUrl: './corsico.component.html',
  styleUrls: ['./corsico.component.scss']
})
export class CorsicoComponent implements OnInit {
  public data: Corsico;
  public seoText: string;
  public isBrowser: boolean = false;
  public windowWidth: number;
  public schema = Schema;

  public translateSubscription: Subscription;
  constructor(
    private sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private corsicoService: CorsicoService,
    private readonly meta: MetaService,
    private browserService: BrowserService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
  ) {
    let request = this.activatedRoute.snapshot.data['corsico'];
    this.isBrowser = this.browserService.getPlatform();
    this.data = request as Corsico;
    this.completeSeoScript();
    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();
      if (this.windowWidth > 992) {
        this.data.logoUrl = this.data.bigLogoUrl;
        this.data.imgPageUrl = this.data.bigPageImageUrl;
      }
      else {
        this.data.logoUrl = this.data.smallLogoUrl;
        this.data.imgPageUrl = this.data.smallPageImageUrl;
      }
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
    this.completeSeoScript();
  }
  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schema.itemListElement[0].item = environment.host; 
      this.schema.itemListElement[1].name = this.translateCore.instant("corsico.name");
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/o-kofe/kofe-corsico";
      
    })

  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        
        let corsicoSub: Subscription = this.corsicoService.getCorsicoData().subscribe(
          res => {
            this.data = res as Corsico;
            this.completeSeoScript();
            if (this.isBrowser) {
              this.windowWidth = this.browserService.getViewPortWidth();
              if (this.windowWidth > 992) {
                this.data.logoUrl = this.data.bigLogoUrl;
                this.data.imgPageUrl = this.data.bigPageImageUrl;
              }
              else {
                this.data.logoUrl = this.data.smallLogoUrl;
                this.data.imgPageUrl = this.data.smallPageImageUrl;
              }
            }
            else {
              this.data.logoUrl = this.data.smallLogoUrl;
              this.data.imgPageUrl = this.data.smallPageImageUrl;
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
            if (corsicoSub) {
              corsicoSub.unsubscribe();
            }
           
          })
      }
    );

  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

  openModal() {
    this.sidebarService.openDegustation();
  }
}
