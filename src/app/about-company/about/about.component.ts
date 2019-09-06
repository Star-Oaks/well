import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatesService } from '../../shared/translates';
import { MetaService } from '@ngx-meta/core';
import { AboutCompany } from '../../shared/model/about-company/about-company';
import { AboutCompanyService } from '../about-company.service';
import { BrowserService } from '../../shared/services/browser.service';
import { AwardsCompany } from '../../shared/model/about-company/awards-company';
import { ValueBlock } from '../../shared/model/about-company/value-block-company';
import { OrganizationsBlock } from '../../shared/model/about-company/organizations-block-company';
import { SocialBlock } from '../../shared/model/about-company/social-block-company';
import { LinkService } from '../../shared/services/link.service';
import { environment } from '../../../environments/environment';
import { Gtag } from 'angular-gtag';
import { TranslateService } from '@ngx-translate/core';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public data: AboutCompany;
  public seoText: string;
  public awards: AwardsCompany;
  public valueBlock: ValueBlock;
  public orgBlock: OrganizationsBlock;
  public socialBlock: SocialBlock;
  public isBrowser: boolean = false;
  public windowWidth: number;
  public currentLang: string;
  public schema = Schema

  public translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslatesService,
    private translateCore: TranslateService,
    private aboutService: AboutCompanyService,
    private readonly meta: MetaService,
    private browserService: BrowserService,
    private linkService: LinkService,
    private router: Router,
    private gtag: Gtag,
  ) {
    this.currentLang = this.translate.getCurrentLang();
    let request = this.activatedRoute.snapshot.data['res'];
    this.isBrowser = this.browserService.getPlatform();
    this.data = request as AboutCompany;
    this.completeSeoScript();
    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();
      if (this.windowWidth > 992) {
        this.data.bannerImageUrl = this.data.bigBannerImageUrl;
      }
      else {
        this.data.bannerImageUrl = this.data.smallBannerImageUrl;
      }
    }
    else {
      this.data.bannerImageUrl = this.data.smallBannerImageUrl;
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
    if (this.data.companyPageAwardBlock) {
      this.awards = this.data.companyPageAwardBlock;
      if (this.awards.companyPageAwardItems.length != 0) {
        this.awards.companyPageAwardItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
      }
    }
    if (this.data.companyPageValuesBlock) {
      this.valueBlock = this.data.companyPageValuesBlock;
      if (this.valueBlock.companyPageValuesItems.length != 0) {
        this.valueBlock.companyPageValuesItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
      }
    }
    if (this.data.companyPageOrganizationsBlock) {
      this.orgBlock = this.data.companyPageOrganizationsBlock;
      if (this.orgBlock.companyPageOrganizationsItems.length != 0) {
        this.orgBlock.companyPageOrganizationsItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
      }
    }
    if (this.data.companyPageSocialBlock) {
      this.socialBlock = this.data.companyPageSocialBlock;
      if (this.socialBlock.companyPageSocialItems.length != 0) {
        this.socialBlock.companyPageSocialItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
      }
    }

  }
  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");;
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("about.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/kompaniya";
    })

  }

  ngOnInit() {
    this.translateSubscription = this.translate.changeLanguageEvent.subscribe(
      () => {
        this.currentLang = this.translate.getCurrentLang();
        let aboutSub: Subscription = this.aboutService.getAboutCompanyData().subscribe(
          res => {
            this.data = res as AboutCompany;
            this.completeSeoScript()
            if (this.isBrowser) {
              this.windowWidth = this.browserService.getViewPortWidth();
              if (this.windowWidth > 992) {
                this.data.bannerImageUrl = this.data.bigBannerImageUrl;
              }
              else {
                this.data.bannerImageUrl = this.data.smallBannerImageUrl;
              }
            }
            else {
              this.data.bannerImageUrl = this.data.smallBannerImageUrl;
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
            if (this.data.companyPageAwardBlock) {
              this.awards = this.data.companyPageAwardBlock;
              if (this.awards.companyPageAwardItems.length && this.awards.companyPageAwardItems.length != 0) {
                this.awards.companyPageAwardItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
              }
            }
            if (this.data.companyPageValuesBlock) {
              this.valueBlock = this.data.companyPageValuesBlock;
              if (this.valueBlock.companyPageValuesItems.length && this.valueBlock.companyPageValuesItems.length != 0) {
                this.valueBlock.companyPageValuesItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
              }
            }
            if (this.data.companyPageOrganizationsBlock) {
              this.orgBlock = this.data.companyPageOrganizationsBlock;
              if (this.orgBlock.companyPageOrganizationsItems.length && this.orgBlock.companyPageOrganizationsItems.length != 0) {
                this.orgBlock.companyPageOrganizationsItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
              }
            }
            if (this.data.companyPageSocialBlock) {
              this.socialBlock = this.data.companyPageSocialBlock;
              if (this.socialBlock.companyPageSocialItems.length != 0) {
                this.socialBlock.companyPageSocialItems.sort((a, b) => a.numberInSequence - b.numberInSequence)
              }
            }
            if (aboutSub) {
              aboutSub.unsubscribe();
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
